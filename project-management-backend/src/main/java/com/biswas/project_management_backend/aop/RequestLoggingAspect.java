package com.biswas.project_management_backend.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class RequestLoggingAspect {

    // Match all controller methods
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerMethods() {}

    // Before execution
    @Before("controllerMethods()")
    public void logBefore(JoinPoint joinPoint) {
        log.info("➡️ API Called: {}.{}() with args={}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                joinPoint.getArgs());
    }

    // After successful return
    @AfterReturning(pointcut = "controllerMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        log.info("✅ API Success: {}.{}() returned={}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                result);
    }

    // After exception
    @AfterThrowing(pointcut = "controllerMethods()", throwing = "error")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable error) {
        log.error("❌ API Error: {}.{}() threw={}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                error.getMessage(), error);
    }
}
