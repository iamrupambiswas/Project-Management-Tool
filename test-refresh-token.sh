#!/bin/bash

################################################################################
# JWT Refresh Token Test Script
################################################################################
# Tests the complete JWT refresh token implementation including:
# - Token generation on registration/login
# - Access token authentication
# - Refresh token rotation
# - Token invalidation after refresh
# - Logout functionality
# - Post-logout security
################################################################################

set -e

# Configuration
BASE_URL="http://localhost:8080/api"
TIMESTAMP=$(date +%s)
COMPANY_NAME="DevCorp Solutions $TIMESTAMP"
DOMAIN="devcorp-$TIMESTAMP.io"
ADMIN_NAME="John Doe"
ADMIN_EMAIL="john.doe.$TIMESTAMP@devcorp.io"
ADMIN_PASSWORD="SecurePass2024"

echo "========================================================================"
echo "JWT REFRESH TOKEN TEST"
echo "========================================================================"
echo "Base URL: $BASE_URL"
echo "Test Email: $ADMIN_EMAIL"
echo ""

# Helper functions
extract_json_value() {
    echo "$1" | grep -o "\"$2\":\"[^\"]*\"" | sed "s/\"$2\":\"\([^\"]*\)\"/\1/" | head -n1
}

extract_json_number() {
    echo "$1" | grep -o "\"$2\":[0-9]*" | sed "s/\"$2\":\([0-9]*\)/\1/" | head -n1
}

decode_jwt() {
    local jwt="$1"
    local payload=$(echo "$jwt" | cut -d'.' -f2)
    echo "${payload}====" | base64 -d 2>/dev/null || echo ""
}

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# ============================================================================
# STEP 1: Register Company with Admin
# ============================================================================
echo "------------------------------------------------------------------------"
echo "STEP 1: Register Company and Admin"
echo "------------------------------------------------------------------------"
echo "POST $BASE_URL/auth/register/company"

REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register/company" \
    -H "Content-Type: application/json" \
    -d "{
        \"companyName\": \"$COMPANY_NAME\",
        \"domain\": \"$DOMAIN\",
        \"admin\": {
            \"name\": \"$ADMIN_NAME\",
            \"email\": \"$ADMIN_EMAIL\",
            \"password\": \"$ADMIN_PASSWORD\"
        }
    }")

HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $RESPONSE_BODY" | head -c 200
echo "..."
echo ""

if [ "$HTTP_CODE" != "200" ]; then
    echo "ERROR: Registration failed"
    exit 1
fi

ORIGINAL_ACCESS_TOKEN=$(extract_json_value "$RESPONSE_BODY" "token")
ORIGINAL_REFRESH_TOKEN=$(extract_json_value "$RESPONSE_BODY" "refreshToken")
USER_EMAIL=$(extract_json_value "$RESPONSE_BODY" "email")
USER_ID=$(extract_json_number "$RESPONSE_BODY" "id")

# Extract company ID from JWT
JWT_PAYLOAD=$(decode_jwt "$ORIGINAL_ACCESS_TOKEN")
COMPANY_ID=$(extract_json_number "$JWT_PAYLOAD" "companyId")

echo "✓ Registration successful"
echo "  User ID: $USER_ID"
echo "  Company ID: $COMPANY_ID"
echo "  Email: $USER_EMAIL"
echo "  Access Token: ${ORIGINAL_ACCESS_TOKEN:0:50}..."
echo "  Refresh Token: $ORIGINAL_REFRESH_TOKEN"
echo ""
TESTS_PASSED=$((TESTS_PASSED + 1))

# ============================================================================
# STEP 2: Test Original Access Token
# ============================================================================
echo "------------------------------------------------------------------------"
echo "STEP 2: Test Original Access Token"
echo "------------------------------------------------------------------------"
echo "GET $BASE_URL/users/company/$COMPANY_ID"

USERS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/company/$COMPANY_ID" \
    -H "Authorization: Bearer $ORIGINAL_ACCESS_TOKEN")

HTTP_CODE=$(echo "$USERS_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$USERS_RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Access token authentication successful"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "✗ Access token authentication failed"
    echo "Response: $RESPONSE_BODY"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    exit 1
fi
echo ""

# ============================================================================
# STEP 3: Refresh Access Token
# ============================================================================
echo "------------------------------------------------------------------------"
echo "STEP 3: Refresh Access Token (Token Rotation Test)"
echo "------------------------------------------------------------------------"
echo "POST $BASE_URL/auth/refresh"
echo "Using refresh token: $ORIGINAL_REFRESH_TOKEN"

REFRESH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/refresh" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$ORIGINAL_REFRESH_TOKEN\"}")

HTTP_CODE=$(echo "$REFRESH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$REFRESH_RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $RESPONSE_BODY" | head -c 200
echo "..."
echo ""

if [ "$HTTP_CODE" != "200" ]; then
    echo "✗ Token refresh failed"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    exit 1
fi

NEW_ACCESS_TOKEN=$(extract_json_value "$RESPONSE_BODY" "token")
NEW_REFRESH_TOKEN=$(extract_json_value "$RESPONSE_BODY" "refreshToken")

echo "New Access Token: ${NEW_ACCESS_TOKEN:0:50}..."
echo "New Refresh Token: $NEW_REFRESH_TOKEN"
echo ""

# Verify token rotation
if [ "$ORIGINAL_ACCESS_TOKEN" != "$NEW_ACCESS_TOKEN" ]; then
    echo "✓ Access token rotation verified (tokens are different)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "✗ Access token rotation FAILED (tokens are identical)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    exit 1
fi

if [ "$ORIGINAL_REFRESH_TOKEN" != "$NEW_REFRESH_TOKEN" ]; then
    echo "✓ Refresh token rotation verified (tokens are different)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "✗ Refresh token rotation FAILED (tokens are identical)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    exit 1
fi
echo ""

# ============================================================================
# STEP 4: Verify Old Refresh Token is Invalidated
# ============================================================================
echo "------------------------------------------------------------------------"
echo "STEP 4: Verify Old Refresh Token is Invalidated (Security Test)"
echo "------------------------------------------------------------------------"
echo "POST $BASE_URL/auth/refresh"
echo "Attempting to reuse old token: $ORIGINAL_REFRESH_TOKEN"

OLD_TOKEN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/refresh" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$ORIGINAL_REFRESH_TOKEN\"}")

HTTP_CODE=$(echo "$OLD_TOKEN_RESPONSE" | tail -n1)

echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "401" ]; then
    echo "✓ Old refresh token correctly rejected (401 Unauthorized)"
    echo "  Security check passed: Token reuse prevented"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "✗ SECURITY ISSUE: Old refresh token was accepted (expected 401)"
    echo "  HTTP Status: $HTTP_CODE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    exit 1
fi
echo ""

# ============================================================================
# STEP 5: Use New Access Token
# ============================================================================
echo "------------------------------------------------------------------------"
echo "STEP 5: Use New Access Token"
echo "------------------------------------------------------------------------"
echo "GET $BASE_URL/users/company/$COMPANY_ID"

NEW_USERS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/company/$COMPANY_ID" \
    -H "Authorization: Bearer $NEW_ACCESS_TOKEN")

HTTP_CODE=$(echo "$NEW_USERS_RESPONSE" | tail -n1)

echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ New access token authentication successful"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "✗ New access token authentication failed"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    exit 1
fi
echo ""

# ============================================================================
# STEP 6: Logout
# ============================================================================
echo "------------------------------------------------------------------------"
echo "STEP 6: Logout"
echo "------------------------------------------------------------------------"
echo "POST $BASE_URL/auth/logout"
echo "Invalidating refresh token: $NEW_REFRESH_TOKEN"

LOGOUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/logout" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$NEW_REFRESH_TOKEN\"}")

HTTP_CODE=$(echo "$LOGOUT_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$LOGOUT_RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $RESPONSE_BODY"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Logout successful"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "✗ Logout failed"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# ============================================================================
# STEP 7: Verify Logout Invalidated Token
# ============================================================================
echo "------------------------------------------------------------------------"
echo "STEP 7: Verify Logout Invalidated Token (Security Test)"
echo "------------------------------------------------------------------------"
echo "POST $BASE_URL/auth/refresh"
echo "Attempting to use logged-out token: $NEW_REFRESH_TOKEN"

LOGGED_OUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/refresh" \
    -H "Content-Type: application/json" \
    -d "{\"refreshToken\": \"$NEW_REFRESH_TOKEN\"}")

HTTP_CODE=$(echo "$LOGGED_OUT_RESPONSE" | tail -n1)

echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "401" ]; then
    echo "✓ Logged-out token correctly rejected (401 Unauthorized)"
    echo "  Security check passed: Post-logout token invalidation works"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "✗ SECURITY ISSUE: Logged-out token was accepted (expected 401)"
    echo "  HTTP Status: $HTTP_CODE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    exit 1
fi
echo ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================
echo "========================================================================"
echo "TEST SUMMARY"
echo "========================================================================"
echo ""
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo ""
echo "Security Features Verified:"
echo "  ✓ Token generation on registration"
echo "  ✓ Access token authentication"
echo "  ✓ Refresh token rotation (new tokens generated)"
echo "  ✓ Old token invalidation (prevents reuse)"
echo "  ✓ New token authentication"
echo "  ✓ Logout functionality"
echo "  ✓ Post-logout token rejection"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "========================================================================"
    echo "ALL TESTS PASSED - JWT Refresh Token Implementation Verified"
    echo "========================================================================"
    exit 0
else
    echo "========================================================================"
    echo "TESTS FAILED"
    echo "========================================================================"
    exit 1
fi
