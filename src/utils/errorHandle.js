import { logout } from '@/api/user'

const errorHandle = async ({ response }) => {
  const { status } = response
  if (process.env.NODE_ENV !== 'development') {
    if (status === 420) {
      await logout()
      window.location.reload()
    }
  }
}

export default errorHandle
