import React from 'react';
import { hashHistory, Link } from "react-router";

import { Tree, Input, Checkbox } from 'antd';

const { TreeNode } = Tree;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children, node.key);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class Test2 extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        checkedBox: []
      }
  }

  onChange1(checkedValues) {
    console.log('checked = ', checkedValues);
    this.setState({
      checkedBox: checkedValues
    })
    console.log("checkedBox= ", this.state.checkedBox)
  }

  onExpand(expandedKeys){
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onChange(e){
    const value = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, gData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data => data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const options = [
      { label: '苹果', value: 'Apple' },
      { label: '梨', value: 'Pear' },
      { label: '橘', value: 'Orange' },
    ];
    const optionsWithDisabled = [
      { label: '苹果', value: 'Apple' },
      { label: '梨', value: 'Pear' },
      { label: '橘', value: 'Orange', disabled: false },
    ];
    
    return (
      <div>
        <Input style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange.bind(this)} />

       <CheckboxGroup options={plainOptions} onChange={this.onChange1.bind(this)} />
    {/* <br />
    <CheckboxGroup options={options} onChange={this.onChange1.bind(this)} />
    <br />
    <CheckboxGroup options={optionsWithDisabled} disabled value={['Apple']} onChange={this.onChange1.bind(this)} /> */}

        <Tree
          onExpand={this.onExpand.bind(this)}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {loop(gData)}
        </Tree>
      </div>
    );
  }
}

export default Test2;