/* eslint-disable no-alert */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */
import { dummyArr, humanFriendlyTime } from "javascript-functions";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import { IoIosArrowBack } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "swiper/css";
import "react-loading-skeleton/dist/skeleton.css";

import ky from "ky";

SwiperCore.use([Navigation]);

function App() {
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState({});
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const changeSlidesPerView = () => {
    if (window.innerWidth > 1440) {
      setSlidesPerView(7);
    }
    if (window.innerWidth <= 650) {
      setSlidesPerView(5);
    }
    if (window.innerWidth <= 500) {
      setSlidesPerView(4);
    }
    if (window.innerWidth <= 400) {
      setSlidesPerView(3);
    }
  };

  const getData = async () => {
    setLoading(true);
    const res = await ky.get("https://cura-front-end-test.herokuapp.com/").json();
    setData(JSON.parse(res).schedule);
    setLoading(false);
  };

  useEffect(() => {
    getData();
    changeSlidesPerView();
    window.addEventListener("resize", () => {
      changeSlidesPerView();
    });
  }, []);

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center p-5">
      <div className="mb-5 w-full rounded-lg border p-5 shadow lg:max-w-[50vw]">
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <h3 className="text-base font-bold">Fees</h3>
          <p className="text-base text-neutral-400">85$</p>
        </div>

        <div className="mb-4">
          <h3 className="mb-3 text-lg font-bold">Schedule</h3>

          <Swiper
            className="p-1"
            slidesPerView={slidesPerView + 0.5}
            spaceBetween={15}
            pagination={{
              clickable: true,
            }}
            navigation={{
              prevEl: prevRef?.current,
              nextEl: nextRef?.current,
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper?.navigation?.init();
              swiper?.navigation?.update();
            }}
          >
            {data.map((ele, i) => (
              <SwiperSlide key={JSON.stringify(i)}>
                <button
                  type="button"
                  className={`flex w-full flex-col items-center rounded-lg p-3 shadow ${
                    selectedDateIndex === i ? "bg-sky-600 text-white" : ""
                  }`}
                  onClick={() => {
                    setSelectedDateIndex(i);
                    setSelectedDate(ele);
                  }}
                >
                  <p className="mb-2 text-base font-bold">{ele.availability.day.substring(0, 3)}</p>
                  <p className="text-base">{ele.availability.date.substring(0, 2)}</p>
                </button>
              </SwiperSlide>
            ))}

            {loading &&
              dummyArr(20).map((_, i) => (
                <SwiperSlide key={JSON.stringify(i)}>
                  <Skeleton height={100} key={JSON.stringify(i)} />
                </SwiperSlide>
              ))}

            <div
              ref={prevRef}
              className="absolute top-[40%] left-0 z-20 hidden w-fit cursor-pointer rounded-full p-1 opacity-25 hover:bg-sky-700 hover:text-white hover:opacity-100 md:block"
            >
              <IoIosArrowBack size={22} />
            </div>
            <div
              ref={nextRef}
              className="absolute top-[40%] right-0 z-20 hidden w-fit cursor-pointer rounded-full p-1 opacity-25 hover:bg-sky-700 hover:text-white hover:opacity-100 md:block"
            >
              <IoIosArrowBack className="rotate-180" size={22} />
            </div>
          </Swiper>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-bold">Choose Time</h3>
          <div className="flex flex-wrap items-center justify-center">
            {data[selectedDateIndex]?.unavailable.map((ele) => (
              <button
                type="button"
                disabled
                className="mb-3 cursor-not-allowed rounded-lg py-2 px-4 text-sm text-neutral-400 opacity-80 shadow me-3"
              >
                {humanFriendlyTime(new Date(ele.from_unix))} -{" "}
                {humanFriendlyTime(new Date(ele.to_unix))}
              </button>
            ))}
            {data[selectedDateIndex]?.available.map((ele) => (
              <button
                type="button"
                className={`mb-3 rounded-lg py-2 px-4 text-sm shadow me-3 ${
                  ele.from_unix === selectedTime.from_unix && ele.to_unix === selectedTime.to_unix
                    ? "bg-sky-600 text-white"
                    : ""
                }`}
                onClick={() => {
                  setSelectedTime(ele);
                }}
              >
                {humanFriendlyTime(new Date(ele.from_unix))} -{" "}
                {humanFriendlyTime(new Date(ele.to_unix))}
              </button>
            ))}

            {loading &&
              dummyArr(6).map((_, i) => (
                <Skeleton height={40} width={200} key={JSON.stringify(i)} className="mb-3 me-3" />
              ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-lg bg-sky-600 py-3 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 lg:max-w-[50vw]"
        disabled={!selectedTime.from_unix}
        onClick={() => {
          console.log(JSON.stringify(selectedDate.availability, null, 4));
          console.log(JSON.stringify(selectedTime, null, 4));
          alert(
            `${`${JSON.stringify(selectedDate.availability, null, 4)} --- ${JSON.stringify(
              selectedTime,
              null,
              4,
            )}`}`,
          );
        }}
      >
        Book Appointment
      </button>
    </div>
  );
}

export default App;
