import './style.css'
import { userStore } from './store'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

let currentPage = 'login'

function renderLogin() {
  document.querySelector('#app').innerHTML = `
    <div class="login-container">
      <div class="login-box">
        <h1>로그인</h1>

        <form class="login-form" id="loginForm">
          <div class="input-group">
            <input
              type="email"
              id="email"
              placeholder="이메일"
              required
            />
          </div>

          <div class="input-group">
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              required
            />
          </div>

          <button type="submit" class="btn-login">로그인</button>
        </form>

        <div class="divider">
          <span>또는</span>
        </div>

        <div class="social-login">
          <button class="btn-social btn-naver">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.6 10.8L6.4 0H0v20h6.4V9.2L13.6 20H20V0h-6.4v10.8z" fill="white"/>
            </svg>
            네이버 로그인
          </button>

          <button class="btn-social btn-kakao">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.477 0 0 3.58 0 8c0 2.79 1.815 5.245 4.56 6.655-.19.705-.787 2.945-.905 3.405-.14.545.2.538.425.39.18-.117 2.89-1.93 3.35-2.295.51.07 1.035.105 1.57.105 5.523 0 10-3.58 10-8S15.523 0 10 0z" fill="#3C1E1E"/>
            </svg>
            카카오 로그인
          </button>
        </div>
      </div>
    </div>
  `

  // 로그인 폼 제출 핸들러
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('로그인 실패')
      }

      const data = await response.json()
      console.log('로그인 응답:', data)
      userStore.getState().setUser({
        id: data.userId,
        email: data.email,
        name: data.nickname
      })

      currentPage = 'dashboard'
      renderDashboard()
    } catch (error) {
      console.error('로그인 에러:', error)
      alert('로그인에 실패했습니다.')
    }
  })

  // 네이버 로그인 버튼
  document.querySelector('.btn-naver').addEventListener('click', () => {
    window.location.href = `${BACKEND_URL}/auth/naver`
  })

  // 카카오 로그인 버튼
  document.querySelector('.btn-kakao').addEventListener('click', () => {
    window.location.href = `${BACKEND_URL}/auth/kakao`
  })
}

function renderDashboard() {
  const user = userStore.getState().user

  if (!user) {
    currentPage = 'login'
    renderLogin()
    return
  }

  document.querySelector('#app').innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-box">
        <h1>대시보드</h1>

        <div class="user-info">
          <h2>사용자 정보</h2>
          <div class="info-item">
            <span class="label">이메일:</span>
            <span class="value">${user.email || '-'}</span>
          </div>
          <div class="info-item">
            <span class="label">이름:</span>
            <span class="value">${user.name || '-'}</span>
          </div>
          <div class="info-item">
            <span class="label">ID:</span>
            <span class="value">${user.id || '-'}</span>
          </div>
        </div>

        <button class="btn-logout" id="logoutBtn">로그아웃</button>
      </div>
    </div>
  `

  // 로그아웃 버튼
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('로그아웃 에러:', error)
    }

    userStore.getState().clearUser()
    currentPage = 'login'
    renderLogin()
  })
}

// 토큰 체크 및 초기 렌더링
async function init() {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/validate`, {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const user = await response.json()
      userStore.getState().setUser({
        id: user.userId,
        email: user.email,
        name: user.nickname
      })
      currentPage = 'dashboard'
      renderDashboard()
    } else {
      renderLogin()
    }
  } catch (error) {
    console.error('토큰 체크 에러:', error)
    renderLogin()
  }
}

init()
