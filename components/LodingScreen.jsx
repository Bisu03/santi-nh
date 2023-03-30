import lodingStyle from "../styles/Lodingscreen.module.css";

const LodingScreen = () => {
  return (
    <>
      <div className={lodingStyle.outer}>
        <div className={lodingStyle.circle}></div>
      </div>
    </>
  );
};

export default LodingScreen;
