const roundTo = (num, to) => Math.ceil(num / to) * to;

const getRandomNum = (from, to) => Math.floor(Math.random() * (to - from + 1)) + from;

const getSex = ({ sex: sexArr }) => ((sexArr.length === 1
  ? sexArr[0]
  : sexArr[Math.round(Math.random())]
) === 'M' ? 'Man' : 'Woman');

const getAge = ({ minAge, maxAge }) => roundTo(getRandomNum(minAge, maxAge), 5);

const getOpinion = ({ category }, rows) => {
  const opinions = rows
    .filter((r) => r.category === category)
    .map((r) => r.opinion);
  return opinions[getRandomNum(0, opinions.length - 1)];
};

const getRandomTime = (minTime, maxTime) => {
  const extraTime = getRandomNum(0, Math.floor((maxTime - minTime) / 5)) * 5;
  return minTime + extraTime;
};

const getAvailableTasks = (rows, timeLeft) => rows.filter(({ minTime }) => minTime <= timeLeft);

const getRandomTask = (rows, opinions, maxTime) => {
  const row = rows[getRandomNum(0, rows.length - 1)];
  try {
    return {
      ...row,
      sex: getSex(row),
      age: getAge(row),
      opinion: getOpinion(row, opinions),
      time: getRandomTime(row.minTime, row.maxTime > maxTime ? maxTime : row.maxTime),
    };
  } catch (e) {
    console.log(row);
    throw e;
  }
};

const shuffleArr = (rawArr) => {
  const arr = [...rawArr];
  let currentIndex = arr.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex], arr[currentIndex]];
  }

  return arr;
};

const getListOfDays = (startDay, endDay, workingDays, daysOff) => {
  const arr = [];
  let hoursToWork = 0;

  for (const dt = new Date(startDay); dt <= new Date(endDay); dt.setDate(dt.getDate() + 1)) {
    const dateObj = new Date(dt);
    const dateStr = dateObj.toISOString().slice(0, 10);

    const maxWorkedHours = workingDays[dateObj.getDay()];
    if (!daysOff.includes(dateStr) && maxWorkedHours) {
      hoursToWork += maxWorkedHours;
      arr.push({ dateStr, hours: maxWorkedHours });
    }
  }

  const totalHoursToWork = +process.env.TOTAL_HOURS_TO_WORK;

  if (hoursToWork < totalHoursToWork) {
    throw new Error(`Not enough hours: get ${hoursToWork} should ${totalHoursToWork}`);
  } else if (hoursToWork > totalHoursToWork) {
    let above = hoursToWork - totalHoursToWork;
    if (above > arr.length) {
      throw new Error('Unsupported case - will need to remove more than 1 hour per day');
    }

    return arr.map(({ dateStr, hours }) => {
      if (above > 0) {
        above -= 1;
        return { dateStr, hours: hours - 1 };
      }

      return { dateStr, hours };
    }).filter(({ hours }) => hours > 0);
  }

  return arr;
};

const logSummary = (calendar, data) => {
  const totalMinsWorked = Object.values(data).reduce((sum, i) => sum + i.timeWorked, 0);
  const realTotalHoursWorked = Math.floor(totalMinsWorked / 60);
  const totalHoursInCalendar = calendar.totalHours;

  const avgHoursDay = (+process.env.TOTAL_HOURS_TO_WORK) / calendar.totalDays;
  const avgBreaks = ((calendar.totalHours - realTotalHoursWorked) * 60) / calendar.totalDays;

  console.log('Total hours in calendar:', totalHoursInCalendar);
  console.log('Total hours generated in simulated work days:', realTotalHoursWorked);
  console.log('Total days:', Object.keys(data).length, '===', calendar.totalDays);
  console.log('Avg. Hours per day:', avgHoursDay);
  console.log('Avg. time of breaks during the day:', avgBreaks);
};

const generateCalendar = () => {
  const dayOffs = process.env.DAYS_OFF.split(';');
  const workingDays = process.env.WORKING_DAYS.split(';').map((i) => +i);

  const dates = getListOfDays(process.env.START_DAY, process.env.END_DAY, workingDays, dayOffs);
  console.log('Worked hours:', dates.reduce((sum, i) => sum + i.hours, 0));
  console.log('Expected:', process.env.TOTAL_HOURS_TO_WORK);

  return {
    dates,
    totalDays: dates.length,
    totalHours: dates.reduce((sum, i) => sum + i.hours, 0),
  };
};

const generateDay = async (time, rows) => {
  const recs = [];
  let timeSpent = 0;
  const maxDayTime = (+time) * 60;
  // add break 30 min
  if (maxDayTime > 60) {
    timeSpent += 30;
  }
  while (timeSpent <= maxDayTime) {
    const timeLeft = maxDayTime - timeSpent;

    const availableTasks = getAvailableTasks(rows.basic, timeLeft);

    if (availableTasks.length === 0) {
      break;
    }

    const task = getRandomTask(availableTasks, rows.opinions, timeLeft);
    timeSpent += task.time;
    recs.push(task);
  }
  const arr = shuffleArr(recs);
  const first = arr.splice(0, 1)[0];
  const second = arr.splice(arr.findIndex((i) => i.id !== first.id), 1)[0];

  return {
    first,
    second,
    time,
    recs: arr,
    timeWorked: recs.reduce((sum, i) => sum + i.time, 0),
  };
};

module.exports = {
  getSex,
  getAge,
  getOpinion,
  getRandomTime,
  getAvailableTasks,
  getRandomTask,
  shuffleArr,
  getListOfDays,

  logSummary,
  generateDay,
  generateCalendar,
};
