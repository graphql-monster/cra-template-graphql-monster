import React from "react";
import './Row.css';

const getElementFromField = (item, field) => {
  const fieldDesc = field

  const names = fieldDesc.name ? fieldDesc.name.split('.') : (field).split('.')
  const element = item[names[0]]

  return { element, name: names[0], names }
}

export const ListRowItem = ({ item, field }) => {
  const { element, name, names } = getElementFromField(item, field)

  if (!element) {
    return (<>ERR NOT EXIST:{name}</>)
  }

  if ((field).component) {
    const component = (field ).component
    return (<>{component && component({ value: element, names, item })}</>)
  }

  if (element.substr && element.length > 50) {
    return (<>{element.substr(0, 47)}...</>)
  }

  if (element.push && element.reduce && names.length > 1) {
    return (<>{(element).reduce((p, e) => p + e[names[1]], '')}</>)
  }

  return (
    <>
      {element}
    </>
  );
};

