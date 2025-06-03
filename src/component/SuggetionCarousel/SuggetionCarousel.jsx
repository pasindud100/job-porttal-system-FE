import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobSuggestions } from '../../store/jobsSlice';
import { useAuth } from '../../context/AuthContext';
import { Box, IconButton, CircularProgress, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';
import JobCard from '../JobCard/JobCard';

const SuggetionCarousel = () => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { resume } = useAuth();
  const dispatch = useDispatch();
  const { suggestedJobs, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (resume) {
      dispatch(fetchJobSuggestions(resume));
    }
  }, [resume, dispatch]);

  return (
    <div className="text-center mb-4">
      <Typography variant="h6" className="mb-2 font-bold text-gray-800">
        {loading
          ? 'Loading job suggestions...'
          : `Found ${suggestedJobs.length} job suggestions`}
      </Typography>

      <div className="max-w-4xl mx-auto relative overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-5">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="text-center py-5 text-red-500">
            Error: {error}
          </div>
        ) : suggestedJobs.length === 0 ? (
          <div className="text-center py-5 text-gray-500">
            No job suggestions found.
          </div>
        ) : (
          <Swiper
            ref={swiperRef}
            spaceBetween={100}
            slidesPerView={Math.min(3, suggestedJobs.length)}
            loop={suggestedJobs.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => {
              setTimeout(() => {
                if (prevRef.current && nextRef.current) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }, 100);
            }}
          >
            {suggestedJobs.map((job) => (
              <SwiperSlide key={job.id}>
                <JobCard job={job} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {suggestedJobs.length > 0 && (
          <>
            <IconButton
              ref={prevRef}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              ref={nextRef}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
};

export default SuggetionCarousel;
