import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/vendor/css/demo.css';
import './css/styles.css'; // Core theme CSS
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css'; // Vendor CSS

const HomePage = () => {
  const [nftItems, setNftItems] = useState([]);
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
      setIsLoading(false); // No cookie, just show login button
    }
  }, []);

  // Fetch data from the API
  useEffect(() => {
    fetch('https://api.nftlix.store/api/nfts')
      .then((response) => response.json())
      .then((data) => setNftItems(data))
      .catch((error) => console.error('Error fetching NFT data:', error));
  }, []);

  return (
    <>
      <Helmet>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          type="text/javascript"
        />
      </Helmet>
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
              <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
              {!isLoading ? (
                userName ? (
                  <li className="nav-item"><a className="nav-link" href="/item/new">NFT(이미지) 등록</a></li>
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
            )}
            </ul>
            <form className="d-flex" method="get" action="/login">
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

      {/* Header */}
      <header className="bg-dark py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="text-center text-white">
            <h1 className="display-4 fw-bolder">내 이미지로 나만의 NFT를 만들어보세요!</h1>
            <p className="lead fw-normal text-white-50 mb-0">
              이미지 변환부터 NFT 민팅, 수익화까지 한 번에, NFTLIX에서
            </p>
          </div>
        </div>
      </header>

      {/* Section */}
      <section className="py-5">
        <div className="container px-4 px-lg-5 mt-5">
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {/* 카드 반복 */}
            {nftItems.length > 0 ? (
              nftItems.map((item, index) => (
                <div className="col mb-5" key={item.id}>
                  <div className="card h-100" onClick={() => window.location.href = `/item/${item.id}`}>
                    <img
                      className="card-img-top"
                      style={{ cursor: "pointer" }}
                      src={item.previewImageUrl}
                      alt={`NFT 상품 ${index + 1}`}
                      width="300"
                      height="200"
                    />
                    <div className="card-body p-4" style={{ cursor: "pointer" }}>
                      <div className="text-center">
                        <h5 className="fw-bolder">{item.name}</h5>
                        {item.price.toLocaleString()} KRW
                      </div>
                    </div>
                    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div className="text-center">
                    {userName ? (
                      <a className="btn btn-outline-dark mt-auto" href={`/item/purchase/${item.id}`}>
                      구매하기
                      </a>
                    ) : (
                      <button className="btn btn-outline-dark mt-auto" disabled>
                      로그인 후 구매 가능
                      </button>
                    )}
                  </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">NFT 상품을 불러오는 중입니다...</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container">
          <p className="m-0 text-center text-white">
            Copyright &copy; NFTLIX 2024
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
