const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => {
    const perms = []
    state.user.menus.forEach((value, index) => {
      perms.push(value.appid)
    })
    return perms
  }
}
export default getters
