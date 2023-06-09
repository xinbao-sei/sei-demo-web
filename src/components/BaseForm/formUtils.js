import React from 'react';
import { Form } from 'antd';
import { isFunction } from 'lodash';

const defaultFormLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const fetchFieldDecorator = (item, getFieldDecorator) => {
  const { name, defaultValue, rules, itemRender, fieldDecoratorProps } = item;
  return getFieldDecorator(name, {
    initialValue: defaultValue,
    rules,
    ...fieldDecoratorProps,
  })(itemRender);
};

/**
 * 根据配置渲染单个表单项
 *
 * @param item
 * @param getFieldDecorator
 * @returns {*}
 */
export const renderFormItem = (item, getFieldDecorator) => {
  const { name, label, formItemLayout, style, formItemProps } = item;
  return (
    <Form.Item key={name} label={label} {...formItemLayout} style={style} {...formItemProps}>
      {fetchFieldDecorator(item, getFieldDecorator)}
    </Form.Item>
  );
};

/**
 * 根据配置渲染所有的表单项
 * @param items
 * @param getFieldDecorator
 * @param formValues
 * @param toggleFieldVisibility
 * @param layout
 * @return
 */
export const renderFormItems = (
  items,
  getFieldDecorator,
  formValues = {},
  toggleFieldVisibility,
  layout,
) =>
  items.map(item => {
    const { style, defaultValue, hidden, ...restProps } = item;
    const display =
      ((hidden === true || (item.toggleField && toggleFieldVisibility === false)) && 'none') ||
      'block';
    let defaultVal = defaultValue;
    if (formValues[item.name] !== undefined) {
      defaultVal = formValues[item.name];
    }
    return renderFormItem(
      {
        formItemLayout: layout === 'vertical' ? null : defaultFormLayout,
        ...restProps,
        style: { ...style, display },
        defaultValue: defaultVal,
      },
      getFieldDecorator,
    );
  });

/**
 * submit form
 * @param form
 * @param formValues
 * @param callback
 * @param extraOptions
 */
export const submitForm = (form, formValues, callback, extraOptions) => {
  if (form) {
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err && isFunction(callback)) {
        callback({ ...formValues, ...fieldsValue }, form, extraOptions);
      }
    });
  } else {
    // eslint-disable-next-line no-console
    console.warn('form is not defined');
  }
};
