import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import useEth from "../../contexts/EthContext/useEth";

const CountdownTimer = ({ targetDate, rpsContract, getGameInfo, gameInfo }) => {
	const { state: {accounts} } = useEth();
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  // Declare a timeout
  const handleTimeOut = async() => {
    const timeoutMethod = gameInfo.player1 === accounts[0] ? rpsContract.methods.j2Timeout : rpsContract.methods.j1Timeout;
    try {
      await timeoutMethod().call({ from: accounts[0] });
      await timeoutMethod().send({ from: accounts[0] });
      getGameInfo();
    } catch (err) {
      alert(err);
    }
  };

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice handleTimeOut={handleTimeOut} />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

const ExpiredNotice = ({ handleTimeOut }) => {
  return (
    <div className="expired-notice">
      <button type="button" style={{marginTop: '10px'}} onClick={handleTimeOut}>
          Declare a timeout and claim back your stack
      </button>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="show-counter">
      <a
        href="https://tapasadhikary.com"
        target="_blank"
        rel="noopener noreferrer"
        className="countdown-link"
      >
        <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
        <p>:</p>
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
      </a>
    </div>
  );
};

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? 'countdown danger' : 'countdown'}>
      <p>{value}</p>
      <span>{type}</span>
    </div>
  );
};

export default CountdownTimer;

