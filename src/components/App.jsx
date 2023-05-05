import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from './App.module.css';
import Searchbar from './Searchbar';
import Modal from './Modal';
import ImageGallery from './ImageGallery';
import Button from './Button';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [modalToShow, setModalToShow] = useState(false);
  const [modalImg, setModalImg] = useState({});

  useEffect(() => {
    if (filter === '') {
      return;
    }
    setIsLoading(true);
    fetch(
      `https://pixabay.com/api/?q=${filter}&page=${currentPage}&key=34544645-2c62a1021489ea1157fadd1e4&image_type=photo&orientation=horizontal&per_page=12`
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        if (data.hits.length === 0) {
          return toast(' WHOOPS!!! No data to show!');
        }
        setImages(images => [...images, ...data.hits]);
      })
      .catch(error => window.alert(error))
      .finally(() => {
        setIsLoading(false);
        if (currentPage !== 1) {
          window.scrollBy({
            top: 500,
            behavior: 'smooth',
          });
        }
      });
  }, [currentPage, filter]);

  const handlePageChanger = () => {
    setCurrentPage(state => state + 1);
  };

  const togleModal = () => {
    setModalToShow(state => !state);
  };

  const getModalImg = (webformatURL, tags) => {
    setModalImg({ webformatURL, tags });
  };

  const onSubmit = event => {
    event.preventDefault();

    switch (event.currentTarget.elements.search.value.trim()) {
      case '':
        toast(`WHOOPS!!! No data to search`);
        break;
      case filter:
        toast(`WHOOPS!!! You are alredy looking on "${filter}"`);
        break;
      default:
        setFilter(event.currentTarget.elements.search.value);
        setCurrentPage(1);
        setImages([]);
    }
  };

  return (
    <div className={css.Container}>
      {modalToShow && <Modal img={modalImg} showModal={togleModal} />}
      <Searchbar onSubmit={onSubmit} />
      {images && (
        <ImageGallery
          getData={getModalImg}
          showModal={togleModal}
          dataToRender={images}
        />
      )}
      {isLoading && (
        <ProgressBar
          height="300"
          width="300"
          ariaLabel="progress-bar-loading"
          wrapperClass={css.progressBarWrapper}
          borderColor="#F4442E"
          barColor="#51E5FF"
        />
      )}

      {images.length !== 0 && <Button onClick={handlePageChanger} />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
