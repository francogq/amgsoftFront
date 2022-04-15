export const canNavigate = (to, roles) => to.matched.some(route => {

    if (route.meta.permittedRoles) {
        const userModuls = roles.map(
            role => role.module_id,
        )
        if (!userModuls.includes(route.meta.module)) return false
        let roleId = roles.filter(
            role => role.module_id === route.meta.module,
        )[0].role_id
        let levelId = roles.filter(
            role => role.module_id === route.meta.module,
        )[0].typesenior
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].module_id == route.meta.module) {
                return (roles[i].module_id == route.meta.module && (to.meta.hasLevelValidation ? (to.meta.permittedRoles.some(permittedRole => (permittedRole.role_id == roleId && (permittedRole.hasLevelValidation ? permittedRole.level_id == levelId : true)))) : to.meta.permittedRoles.includes(roleId)))
            }
        }
    } else {
        return true
    }
})
export const _ = undefined
