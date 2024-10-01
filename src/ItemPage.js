import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/vendor/css/demo.css';
import './css/styles.css'; // Core theme CSS
import './assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css'; // Vendor CSS

const ItemPage = () => {
  const { id } = useParams(); // Get item ID from the URL
  const [nftData, setNftData] = useState(null); // State to store fetched NFT data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [userName, setUserName] = useState(null); // State to hold the logged-in user name
  const [isLoading, setIsLoading] = useState(true); // To manage loading state
  const [nftItems, setNftItems] = useState([]);

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

  const purchase = () => {
    window.location = `/item/purchase/${id}`;
  }

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

  // Fetch data from the API
  useEffect(() => {
    fetch('https://api.nftlix.store/api/nfts')
      .then((response) => response.json())
      .then((data) => setNftItems(data))
      .catch((error) => console.error('Error fetching NFT data:', error));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!nftData) {
    return <div>No data available.</div>;
  }

  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <a className="navbar-brand" href="/">NFTLIX</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item"><a className="nav-link active" aria-current="page" href="/">Home</a></li>
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
                  <li class="nav-item dropdown" style={{ "listStyleType": "none" }}>
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

      {/* Product section */}
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img className="card-img-top mb-5 mb-md-0" alt="NFT Image" src={nftData.mainImageUrl || "https://dummyimage.com/600x700/dee2e6/6c757d.jpg"} />
            </div>
            <div className="col-md-6">
              <div className="small mb-1">{nftData.name}</div>
              <h1 className="display-5 fw-bolder">{nftData.name}</h1>
              <div className="fs-5 mb-5">
                <span>{nftData.memberName}</span>
              </div>
              <div className="fs-5 mb-5">
                <span>{nftData.price} KRW</span>
              </div>
              <div className="fs-5 mb-5">
                <span>{nftData.royalty}% Royalty</span>
              </div>
              <div className="small mb-1">NFT 설명</div>
              <p className="lead">{nftData.description}</p>

              <div className="small mb-1">NFT 특전</div>
              <p className="lead">{nftData.privilege}</p>

              <div className="d-flex">
                <input className="form-control text-center me-3" id="inputQuantity" type="number" value="1" style={{ maxWidth: '3rem' }} disabled />

                {userName ? (
                      <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={purchase}>
                      <i className="bi-cart-fill me-1"></i>
                      구매하기
                    </button>
                    ) : (
                      <button className="btn btn-outline-dark flex-shrink-0" type="button" disabled>
                      <i className="bi-cart-fill me-1"></i>
                      로그인 후 구매 가능
                      </button>
                    )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related items section */}
      <section className="py-5 bg-light">
        <div className="container px-4 px-lg-5 mt-5">
          <h2 className="fw-bolder mb-4">Related products</h2>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {/* 카드 반복 - 최대 4개의 아이템만 표시 */}
            {nftItems.length > 0 ? (
              nftItems
              .filter((item) => item.id !== id)  // 현재 아이템을 필터링
              .slice(0, 4)  // 4개의 아이템만 선택
              .map((item, index) => (
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
          <p className="m-0 text-center text-white">Copyright &copy; NFTLIX 2024</p>
        </div>
      </footer>
    </>
  );
};

export default ItemPage;
