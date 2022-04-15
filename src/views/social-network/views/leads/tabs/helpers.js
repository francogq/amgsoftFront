const resolveLeadSnStatusVariant = (status) => {
    if (status === 2) return "success";
    if ([3, 4].includes(status)) return "primary";
    if (status === 5) return "secondary";
    if (status === 6) return "warning";
    if (status === 7) return "danger";
    return "primary";
}

export default {resolveLeadSnStatusVariant};