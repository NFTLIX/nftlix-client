import React, { useEffect, useState } from 'react';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/css/demo.css';
import './assets/vendor/css/pages/page-auth.css';

import './assets/vendor/js/helpers.js';
import './assets/vendor/js/bootstrap.js';
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js';
import './assets/vendor/js/menu.js';

const CreateItemPage = () => {

  const [userName, setUserName] = useState(null); // State to hold the logged-in user name
  const [isLoading, setIsLoading] = useState(true); // To manage loading state

  // Helper function to get a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Helper function to delete a cookie by name
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Handle logout
  const handleLogout = () => {
    deleteCookie('id'); // Delete the 'id' cookie
    window.location.reload(); // Refresh the page
  };

  // Fetch the user data if the cookie exists
  useEffect(() => {
    const userIdCookie = getCookie('id'); // Look for 'id' cookie

    if (userIdCookie) {
      // If cookie exists, call the API
      fetch(`https://api.nftlix.store/api/member/login?id=${userIdCookie}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            setUserName(data.name); // Set the user's name if successful
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          // If error occurs, keep the login button
        })
        .finally(() => setIsLoading(false)); // Finished loading
    } else {
      window.location.href = `/`;  // If not log in, redirect to home page
    }
  }, []);

  const [nftData, setNftData] = useState({
    name: '',
    description: '',
    price: '',
    royalty: 0.5,
    privilege: '',
    filter: 'cartoonization',
    memberId: getCookie('id'),
  });
  
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!nftData.name) newErrors.name = 'NFT 이름을 적어주세요!';
    if (!nftData.description) newErrors.description = 'NFT 설명을 적어주세요!';
    if (!nftData.price) newErrors.price = 'NFT 가격을 적어주세요!';
    if (!image) newErrors.image = 'NFT 이미지를 선택해주세요!';
    if (!nftData.filter) newErrors.filter = 'NFT 이펙트를 적어주세요!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const formData = new FormData();
    const nftDataInfo = new Blob([JSON.stringify(nftData)], { type: 'application/json' });
    const imageInfo = new Blob([image], { type: "multipart/form-data" });
    formData.append('nftRequest', nftDataInfo);
    formData.append('image', imageInfo);
  
    try {
      const response = await fetch('https://api.nftlix.store/api/nfts', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const responseData = await response.json(); // 응답에서 JSON 파싱
        const itemId = responseData.id; // 응답에서 'id' 추출
  
        if (itemId) {
          window.location.href = `/item/${itemId}`; // 해당 item으로 리다이렉트
        }
      } else {
        alert('NFT 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <a className="navbar-brand" href="/">NFTLIX</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
            </ul>
            <form className="d-flex" method="get" action="/loginForm">
            {!isLoading ? (
                userName ? (
                  <li class="nav-item dropdown" style={{ "list-style-type": "none" }}>
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{userName}님</a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li><a class="dropdown-item" onClick={handleLogout}>로그아웃</a></li>
                    </ul>
                  </li>
                ) : (
                  <button className="btn btn-outline-dark" type="submit">로그인</button>
                )
              ) : (
                <span className="navbar-text">Loading...</span>
            )}
            </form>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="content-wrapper">
        <form action="/addItem" method="post" encType="multipart/form-data">
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* NFT 기본 정보 */}
            <div className="card mb-4">
              <h5 className="card-header">NFT 기본 정보</h5>

              <div className="card-body">
              {errors.name && <div className="form-text" style={{ color: '#bd2130' }}>
                  NFT 이름을 적어주세요!
                </div>}
                <div>
                  <label htmlFor="nameInput" className="form-label">NFT 이름</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    name="nameInput"
                    placeholder="이름을 적어주세요..."
                    value={nftData.name}
                    onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
                  />
                  <div className="form-text">NFT를 가장 잘 설명할 수 있는 이름을 적어주세요.</div>
                </div>
              </div>

              <div className="card-body">
              {errors.description && <div className="form-text" style={{ color: '#bd2130' }}>
                  NFT 설명을 적어주세요!
                </div>}
                <div>
                  <label htmlFor="descriptionInput" className="form-label">NFT 설명</label>
                  <input
                    type="text"
                    className="form-control"
                    id="descriptionInput"
                    name="descriptionInput"
                    placeholder="설명을 적어주세요..."
                    value={nftData.description}
                    onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                  />
                  <div className="form-text">NFT에 대한 간략한 설명을 적어주세요.</div>
                </div>
              </div>
            </div>

            {/* NFT 가격 정보 */}
            <div className="card mb-4">
              <h5 className="card-header">NFT 가격 정보</h5>
              <div className="card-body">
              {errors.price && <div className="form-text" style={{ color: '#bd2130' }}>
                  NFT 가격을 적어주세요!
                </div>}
                
                <div>
                  <label htmlFor="priceInput" className="form-label">NFT 가격</label>
                  <input
                    type="number"
                    className="form-control"
                    id="priceInput"
                    name="priceInput"
                    placeholder="가격을 적어주세요..."
                    value={nftData.price}
                    onChange={(e) => setNftData({ ...nftData, price: e.target.value })}
                  />
                  <div className="form-text">NFT 가격을 적어주세요. (ex: 50000)</div>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <label htmlFor="royaltyInput" className="form-label">NFT 로열티</label>
                  <input
                    type="range"
                    className="form-range"
                    id="royaltyInput"
                    name="royaltyInput"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    defaultValue="0.5"
                    value={nftData.royalty}
                    onChange={(e) => setNftData({ ...nftData, royalty: parseFloat(e.target.value) })}
                  />
                  <div className="form-text">NFT 원소유주에게 제공되는 지속적 로열티를 선택해주세요. (ex: 0.0 ~ 1.0)</div>
                </div>
              </div>
            </div>

            {/* NFT 부가 정보 */}
            <div className="card mb-4">
              <h5 className="card-header">NFT 부가 정보</h5>
              <div className="card-body">
                <div>
                  <label htmlFor="privilegeInput" className="form-label">NFT 특전</label>
                  <input
                    type="text"
                    className="form-control"
                    id="privilegeInput"
                    name="privilegeInput"
                    placeholder="특전을 적어주세요..."
                    value={nftData.privilege}
                    onChange={(e) => setNftData({ ...nftData, privilege: e.target.value })}
                  />
                  <div className="form-text">NFT 소유자를 대상으로 진행하는 특전이 있다면, 적어주세요.</div>
                </div>
              </div>
            </div>

            {/* 이미지 첨부 */}
            <div className="card mb-4">
              <h5 className="card-header">NFT 이미지 정보</h5>
              <div className="card-body">
              {errors.image && <div className="form-text" style={{ color: '#bd2130' }}>
                  이미지를 선택해주세요!
                </div>}
                <div className="mb-3">
                  <label htmlFor="mainImageFile" className="form-label">NFT로 변환할 이미지를 선택해주세요.</label>
                  <input 
                    className="form-control" 
                    type="file" 
                    id="mainImageFile" 
                    name="mainImageFile" 
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                {errors.filter && <div className="form-text" style={{ color: '#bd2130' }}>
                NFT 이펙트를 적어주세요!
                </div>}
                <div className="mb-3">
                  <label htmlFor="imageEffect" className="form-label">사용할 이펙트를 선택해주세요.</label>
                  <select 
                    className="form-select" 
                    id="imageEffect" 
                    name="effect"
                    value={nftData.filter}
                    onChange={(e) => setNftData({ ...nftData, filter: e.target.value })}
                  >
                    <option value="cartoonization" defaultChecked>만화화</option>
                    <option value="black-and-white">흑백화</option>
                    <option value="nukki">누끼 따기</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>NFT 생성</button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container">
          <p className="m-0 text-center text-white">Copyright &copy; NFTLIX 2024</p>
        </div>
      </footer>
    </>
  );
};

export default CreateItemPage;
