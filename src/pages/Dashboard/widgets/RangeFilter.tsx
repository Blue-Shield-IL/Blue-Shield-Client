import DateRangePicker from "components/DateRangePicker";
import useDateRange from "contexts/dateRangeContext/useDateRange";

const RangeFilter = () => {
  const { preset, setPreset, setCustomRange, startDate, endDate } =
    useDateRange();

  return (
    <DateRangePicker
      preset={preset}
      startDate={startDate}
      endDate={endDate}
      onPresetChange={setPreset}
      onCustomRange={setCustomRange}
    />
  );
};

export default RangeFilter;
