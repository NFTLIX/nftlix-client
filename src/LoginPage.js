import React, { useState } from 'react';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/css/demo.css';
import './assets/vendor/css/pages/page-auth.css';

import './assets/vendor/js/helpers.js';
import './assets/vendor/js/bootstrap.js';
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js';
import './assets/vendor/js/menu.js';

const LoginPage = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. ID 또는 비밀번호 입력 확인
    if (!loginId || !password) {
      alert('ID와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 2. API 요청 보내기
    try {
      const response = await fetch('https://api.nftlix.store/api/member/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // 3. 성공 시 쿠키에 저장하고 리다이렉트
        document.cookie = `id=${data.id}; path=/`; // 쿠키에 id 저장
        window.location.href = '/'; // 홈 페이지로 리다이렉트
      } else {
        // 4. 실패 시 알림
        alert('아이디 또는 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('로그인 중 오류가 발생했습니다:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <a href="/" className="app-brand-link gap-2">
                  <span className="app-brand-logo demo">
                    <img src="./assets/favicon.ico" width="50px" height="50px" alt="logo" />
                  </span>
                </a>
              </div>

              <h4 className="mb-2">NFTLIX에 오신 것을 환영합니다! 👋</h4>
              <p className="mb-4">NFT를 민팅하거나 구매하시려면 로그인해주세요!</p>

              <form id="formAuthentication" className="mb-3" onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="loginId" className="form-label">ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="loginId"
                    name="loginId"
                    placeholder="ID를 입력해주세요"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">Password</label>
                  </div>
                  <div className="input-group input-group-merge">
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                  </div>
                </div>
                <div className="mb-3">
                  <button className="btn btn-primary d-grid w-100" type="submit">로그인</button>
                </div>
              </form>

              <p className="text-center">
                <span>처음 방문하셨나요?</span>
                <a href="/signup">
                  <span> 계정 만들기</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
