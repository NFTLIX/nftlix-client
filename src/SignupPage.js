import React, { useState } from 'react';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/css/demo.css';
import './assets/vendor/css/pages/page-auth.css';

import './assets/vendor/js/helpers.js';
import './assets/vendor/js/bootstrap.js';
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js';
import './assets/vendor/js/menu.js';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    loginId: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // API call to signup
    fetch('https://api.nftlix.store/api/member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 201) {
          alert('회원가입에 성공했습니다!');
          window.location.href = '/'; // Redirect to home page
        } else if (response.status === 409) {
          alert('로그인 id가 중복되었습니다. 다른 id를 사용해주세요.');
        } else {
          alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      })
      .catch((error) => {
        console.error('Error during signup:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      });
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
              <h4 className="mb-2">NFTLIX 회원가입 🚀</h4>
              <p className="mb-4">NFTLIX에서 원하는 사진을 NFT로 바꿔보세요!</p>
              <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="name"
                    placeholder="이름을 입력해주세요"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginId" className="form-label">ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="loginId"
                    name="loginId"
                    placeholder="ID를 입력해주세요"
                    value={formData.loginId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 form-password-toggle">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group input-group-merge">
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="비밀번호를 입력해주세요"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button className="btn btn-primary d-grid w-100">회원가입</button>
              </form>
              <p className="text-center">
                <span>이미 계정을 가지고 있으세요?</span>
                <a href="/login">로그인</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
