import { jsx as _jsx } from "react/jsx-runtime";
import DashboardWidgets from "../components/DashboardWidgets";
export default function Dashboard() {
    return (_jsx("div", { className: "p-6", children: _jsx(DashboardWidgets, {}) }));
}
