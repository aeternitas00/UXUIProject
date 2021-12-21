export const DateFunc = {

	getLastDateofMonth : (idate)=>{
		return (new Date(idate.getFullYear(), idate.getMonth()+1, 0)).getDate();
	},

	normalizeDate : (idate,isWeek)=>{

		if(isWeek){	
			const lastDateofTheMonth = DateFunc.getLastDateofMonth(idate);
			const week = Math.floor(idate.getUTCDate()/7);
			const weekF = 1 + 7*week <= lastDateofTheMonth ? 1 + 7*week : lastDateofTheMonth;
	
			idate.setDate(weekF);
			return idate;
		}
		idate.setDate(1)
		return idate;
	},

	normalizeDay : (idate)=>{
		idate.setHours(0,0,0,0);
		return idate;
	},

	isSameDay : (lDate,RDate) => {
		return (
			lDate.getFullYear()==RDate.getFullYear()&&
			lDate.getMonth()==RDate.getMonth()&&
			lDate.getDate()==RDate.getDate()
		);
	},

	weekMap : [
		{string:'일',color:'red'},
		{string:'월'},{string:'화'},{string:'수'},{string:'목'},{string:'금'},
		{string:'토',color:'blue'}
	],
	
	monthMap : [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	],
};

export const MathFunc = {
	clamp : (num, min, max) => {return Math.min(Math.max(num, min), max)}
}
