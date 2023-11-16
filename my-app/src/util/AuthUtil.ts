import authApi from "../api/authClient"

const authUtils = {
  isAuthenticated: async () => {
    const token = localStorage.getItem('token')
    if (!token) return false
    try {
      const res = await authApi.verifyToken()
      return res 
    } catch {
      return false
    }
  }
}

export default authUtils