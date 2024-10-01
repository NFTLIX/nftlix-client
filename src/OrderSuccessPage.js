import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/vendor/css/demo.css';
import './css/styles.css'; // Core theme CSS
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css'; // Vendor CSS

const OrderSuccessPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [nftData, setNftData] = useState(null); // Store the NFT data
  const [userName, setUserName] = useState(null); // State to hold the logged-in user name
  const [isLoading, setIsLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state

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

  useEffect(() => {
    // Fetch NFT data using the id from URL
    const fetchNftData = async () => {
      try {
        const response = await fetch(`https://api.nftlix.store/api/nfts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch NFT data');
        }
        const data = await response.json();
        setNftData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNftData();
  }, [id]);

  const handleMintNFT = async () => {
    try {
      if (nftData && nftData.id) {
        const mintInfo = {"id": nftData.id};
        const response = await fetch('https://api.nftlix.store/api/nfts/mint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mintInfo),
        });
        if (response.ok) {
          alert('NFT 민팅 성공에 성공했습니다! (테스트 계정에 민팅됩니다.)');
        }
        else {
          console.error('NFT 민팅 실패', error);
          alert('NFT 민팅에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('NFT 민팅 실패', error);
      alert('NFT 민팅에 실패했습니다.');
    }
  };

  if (!nftData) {
    return <p>Loading...</p>; // Show loading message until data is fetched
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <a className="navbar-brand" href="/">NFTLIX</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
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
            <form className="d-flex">
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

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="col-md">
            <h5 className="my-4">😊 구매해주셔서 감사합니다!</h5>

            {/* Carousel */}
            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
              <ol className="carousel-indicators">
                <li data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true"></li>
                <li data-bs-target="#carouselExample" data-bs-slide-to="1"></li>
              </ol>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img className="d-block w-100" src={nftData.mainImageUrl} alt="NFT 이미지 1" />
                </div>
                <div className="carousel-item">
                  <img className="d-block w-100" src={nftData.previewImageUrl} alt="NFT 이미지 2" />
                </div>
              </div>
              <a className="carousel-control-prev" href="#carouselExample" role="button" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselExample" role="button" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </a>
            </div>

            {/* NFT Benefits */}
            <div className="col-12" style={{ marginTop: '50px' }}>
              <div className="card mb-4">
                <h5 className="card-header">🎁 NFT 구매 혜택</h5>
                <div className="card-body">
                  <p className="card-text">NFT를 구매하신 분에게는 NFT의 소유자임을 인증하는 메타데이터를 발급해드립니다!</p>
                  <a href={nftData.metadataUrl} className="btn btn-primary" target="_blank" rel="noreferrer">메타데이터 다운로드</a>
                </div>
              </div>

              {/* NFT Minting */}
              <div className="card mb-4">
                <h5 className="card-header">🪙 NFT 민팅하기</h5>
                <div className="card-body">
                  <p className="card-text">NFT를 메타마스크 지갑에 민팅하세요!</p>
                  <button onClick={handleMintNFT} className="btn btn-primary">NFT 민팅</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container">
          <p className="m-0 text-center text-white">Copyright &copy; NFTLIX 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default OrderSuccessPage;
