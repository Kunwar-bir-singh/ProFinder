import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { clearAuth, setUser } from '../slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { accessToken, isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const logout = () => {
    dispatch(clearAuth())
  }

  const setUserData = (userData: any) => {
    dispatch(setUser(userData))
  }

  return {
    accessToken,
    isAuthenticated,
    user,
    logout,
    setUserData,
  }
}
