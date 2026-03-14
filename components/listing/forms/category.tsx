import { Field, Form, Formik } from "formik";
import {
  resetSubCategories,
  updateBasicInfoField,
  updateCategory,
  updateSubCategory,
} from "features/boat/boatSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { categories, subCategories } from "./data";
import { returnClass } from "@/components/shared/styles/input";
import { Theme, useTheme } from "@mui/material/styles";

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import useFetcher from "@/lib/hooks/use-axios";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const CategoryForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: {
  values: any;
  errors: any;
  touched: any;
  handleChange: any;
  handleBlur: any;
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { fetchCategories, data } = useFetcher();

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(
    name: string,
    categoryName: readonly string[],
    theme: Theme,
  ) {
    return {
      fontWeight:
        categoryName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const updateCategories = (value?: string) => {
    dispatch(updateCategory(value));
  };

  const updateSubCategories = (value: string) => {
    dispatch(updateSubCategory(value));
  };

  useEffect(() => {
    fetchCategories("/boat/categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-0 px-4">
      <p className="text-xl font-semibold text-gray-900">Category</p>
      <hr className="mb-6 mt-3 h-px border-0 bg-gray-200" />

      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot sx={{ bgcolor: "#219ebc" }} />
            <TimelineConnector sx={{ bgcolor: "#219ebc" }} />
          </TimelineSeparator>
          <TimelineContent>
            <div className="relative w-full">
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-chip-label">
                  Categories
                </InputLabel>

                <Select
                  id="category"
                  name="category"
                  multiple
                  value={values.category}
                  onChange={(event) => {
                    handleChange(event);
                    updateCategories(event.target.value);
                  }}
                  sx={{
                    ".MuiOutlinedInput-notchedOutline": {
                      border: 0,
                      boxShadow: "0px 0.25px 0px 1px #ccc",
                    },
                  }}
                  onBlur={handleBlur}
                  variant="standard"
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Categories"
                    />
                  }
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {selected.map((value: any) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {data?.categoriesEnum.map((category: string) => (
                    <MenuItem
                      key={category}
                      value={category}
                      style={getStyles(category, values.category, theme)}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {errors.category && touched.category && (
              <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                {errors.category as string}
              </p>
            )}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot sx={{ bgcolor: "#219ebc" }} />
            <TimelineConnector sx={{ bgcolor: "#219ebc" }} />
          </TimelineSeparator>
          <TimelineContent>
            <div className="mt-5 flex flex-row">
              <div className="w-7"></div>
              <div className="relative w-full">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>Subcategory</InputLabel>

                  <Select
                    id="subCategory"
                    name="subCategory"
                    multiple
                    value={values.subCategory}
                    onChange={(event) => {
                      handleChange(event);
                      updateSubCategories(event.target.value);
                    }}
                    sx={{
                      ".MuiOutlinedInput-notchedOutline": {
                        border: 0,
                        boxShadow: "0px 0.25px 0px 1px #ccc",
                      },
                    }}
                    onBlur={handleBlur}
                    input={<OutlinedInput label="subCategories" />}
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {selected.map((value: any) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {data?.subCategoriesEnum
                      .filter((cat: string) => cat !== "Powerboat Lessons")
                      .map((category: string) => (
                        <MenuItem
                          key={category}
                          value={category}
                          style={getStyles(category, values.subCategory, theme)}
                        >
                          {category}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
};

export default CategoryForm;
