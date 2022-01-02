import React, { useCallback, useState } from "react";
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import "./FilterItem.css";

const basicOptionsName = {
  contains: "contains",
  not_contains: "not contains",
  starts_with: "starts with",
  not_starts_with: "not starts with",
  ends_with: "ends with",
  not_ends_with: "not ends with",
  isEmpty: "is empty",
};

export const FilterItem = ({ fields, onChange }) => {
  const [fieldSelected, setFieldSelected] = useState(fields[0]);
  const [optionSelected, setOptionSelected] = useState("contains");
  const [filterText, setFilterText] = useState("");
  const [filter, setFilter] = useState("null");

  const onFieldChange = (field) => {
    setFieldSelected(field);
    processFilter(field, optionSelected, filterText);
  };

  const onOptionChange = (option) => {
    setOptionSelected(option);
    processFilter(fieldSelected, option, filterText);
  };

  const onFilterChange = (e) => {
    const text = e.target.value;
    setFilterText(text);
    processFilter(fieldSelected, optionSelected, text);
  };

  const doFilter = useCallback(
    (f) => {
      if (filter !== f) {
        setFilter(f);
        onChange(f);
      }
    },
    [filter, onChange, setFilter]
  );

  const processFilter = useCallback(
    (field, option, text) => {
      if (!text && option !== "isEmpty") {
        doFilter(null);
        return;
      }

      const f = {};
      f[`${field}_${option}`] = text;
      doFilter(f);
    },
    [doFilter]
  );

  const gc = (o) => {
    const o2 = o;
    return () => {
      onFieldChange(o2);
    };
  };

  const go = (o) => {
    const o2 = o;
    return () => {
      onOptionChange(o2);
    };
  };

  return (
    <InputGroup className="mb-3">
      <DropdownButton
        className="field-option"
        as={InputGroup.Prepend}
        variant="success"
        title={fieldSelected}
        id="input-group-dropdown-0"
      >
        {fields.map((o) => (
          <Dropdown.Item key={o} onClick={gc(o)}>
            {o.toString()}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <DropdownButton
        className="select-option"
        as={InputGroup.Prepend}
        variant="outline-link"
        title={basicOptionsName[optionSelected]}
        id="input-group-dropdown-1"
      >
        {Object.getOwnPropertyNames(basicOptionsName).map((o) => (
          <Dropdown.Item key={o} onClick={go(o)}>
            {basicOptionsName[o]}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <Form.Control value={filterText} onChange={onFilterChange} />
    </InputGroup>
  );
};

export default FilterItem;
