import { useEffect, useRef } from "react";
import { ExclamationCircleFill } from "react-bootstrap-icons";

function EmptyError({triggerVibration, emptyErrorMsg = "필수 입력 항목입니다"}) {
  const errRef = useRef();

  useEffect(() => {
    if (triggerVibration && errRef.current) {
      errRef.current.classList.add('vibration');

      setTimeout(() => {
        errRef.current?.classList.remove('vibration');
      }, 2000);
    }
  }, [triggerVibration]);

  return(
    <>
      <p className='emptyErrorMsg d-flex align-items-center justify-content-center' ref={errRef}>
        <ExclamationCircleFill className='emptyIcon'/>
        <span className="">{emptyErrorMsg}</span>
      </p>
    </>
  );
}

export default EmptyError;
