import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MapIcon from "@mui/icons-material/Map";
import { IconButton, AppBar } from "@mui/material";
import Link from "next/link";

export type StationFilterProps = {
  cityOptions: string[];
  districtMap: Record<string, string[]>;
  onFilterChange: (filter: {
    keyword: string;
    city: string;
    district: string;
    category: string;
    specialFilter: string[];
  }) => void;
};

const categoryOptions = [
  { label: "全部類別", value: "" },
  { label: "寶特瓶", value: "PET" },
  { label: "牛奶瓶", value: "HDPE" },
  { label: "PP塑膠杯", value: "PP" },
  { label: "鋁罐", value: "ALU" },
  { label: "乾電池", value: "BATTERY" },
];

const StationFilter: React.FC<StationFilterProps> = ({
  cityOptions,
  districtMap,
  onFilterChange,
}) => {
  // const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [specialFilter, setSpecialFilter] = useState<string[]>([]);

  const districtOptions = selectedCity ? districtMap[selectedCity] || [] : [];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  useEffect(() => {
    onFilterChange({
      keyword: debouncedKeyword,
      city: selectedCity,
      district: selectedDistrict,
      category: selectedCategory,
      specialFilter: specialFilter,
    });
    // eslint-disable-next-line
  }, [
    debouncedKeyword,
    selectedCity,
    selectedDistrict,
    selectedCategory,
    specialFilter,
  ]);

  useEffect(() => {
    setSelectedDistrict("");
  }, [selectedCity]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: { xs: "56px", sm: "64px" },
        zIndex: 40,
        bgcolor: "background.default",
        px: { xs: 2, sm: 4, md: 8 },
      }}
    >
      {/* 三個下拉選單響應式排列 */}
      <Stack direction={"row"} spacing={0.5} sx={{ py: 1.5 }}>
        {/* 縣市下拉 */}
        <FormControl
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 1,
          }}
          fullWidth
          size="small"
          variant="outlined"
        >
          <InputLabel id="city-select-label">縣市</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            value={selectedCity}
            label="縣市"
            onChange={e => setSelectedCity(e.target.value)}
            aria-label="選擇縣市"
            inputProps={{ tabIndex: 0 }}
          >
            <MenuItem value="">全部縣市</MenuItem>
            {cityOptions.map(city => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* 鄉鎮下拉 */}
        <FormControl
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 1,
          }}
          fullWidth
          size="small"
          variant="outlined"
          disabled={!selectedCity}
        >
          <InputLabel id="district-select-label">鄉鎮</InputLabel>
          <Select
            labelId="district-select-label"
            id="district-select"
            value={selectedDistrict}
            label="鄉鎮"
            onChange={e => setSelectedDistrict(e.target.value)}
            aria-label="選擇鄉鎮"
            inputProps={{ tabIndex: 0 }}
          >
            <MenuItem value="">全部鄉鎮</MenuItem>
            {districtOptions.map(district => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 回收類別下拉 */}
        <FormControl
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 1,
          }}
          fullWidth
          size="small"
          variant="outlined"
        >
          <InputLabel id="category-select-label">回收類別</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="回收類別"
            onChange={e => setSelectedCategory(e.target.value)}
            aria-label="選擇回收類別"
            inputProps={{ tabIndex: 0 }}
          >
            {categoryOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Link href="/stations/map">
          <IconButton sx={{ pl: 0.5, pr: 0, py: 1 }}>
            <MapIcon />
          </IconButton>
        </Link>
      </Stack>
      {/* 
        <Stack direction={"row"} spacing={0.5} sx={{ width: "100%" }}>
          
          
          
         
        </Stack> */}

      {/* <Stack direction={"row"} spacing={1} sx={{ width: "100%" }}>
          
          <TextField
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
            }}
            fullWidth
            size="small"
            variant="outlined"
            placeholder="搜尋站點名稱..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            aria-label="搜尋站點名稱"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButton
            value="favorite"
            selected={specialFilter.includes("favorite")}
            onChange={() => handleSpecialFilterChange("favorite")}
            size="small"
            aria-label="我的最愛"
          >
            <StarIcon />
          </ToggleButton>
          <ToggleButton
            value="campaign"
            selected={specialFilter.includes("campaign")}
            onChange={() => handleSpecialFilterChange("campaign")}
            size="small"
            aria-label="活動"
          >
            <EmojiEventsIcon />
          </ToggleButton>

          <IconButton
            sx={{
              width: 40,
              height: 40,
              p: 0,
              border: "1px solid",
              borderColor: "rgba(0, 0, 0, 0.12)",
              borderRadius: "4px",
            }}
            aria-label="地圖"
            onClick={() => router.push("/stations/map")} // TODO: 請根據您的實際路由修改
          >
            <MapIcon />
          </IconButton>
        </Stack> */}
    </AppBar>
  );
};

export default StationFilter;
