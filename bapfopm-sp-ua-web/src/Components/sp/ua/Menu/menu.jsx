import { hashHistory, Link } from 'react-router';
import { Menu, Icon, Switch } from 'antd';

require('./menu.css')

const { SubMenu } = Menu;

class Sider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'inline',
      theme: 'dark',
      menuData: []
    }
  }

  changeMode(value) {
    this.setState({
      mode: value ? 'vertical' : 'inline',
    });
  }

  changeTheme(value) {
    this.setState({
      theme: value ? 'light' : 'dark',
    });
  }

  async componentWillMount() {
    console.log(this.props.systemId);

    var data = await this.props.handle();
    var listData = data.dataObject;
    // console.log('---', listData);

    let temp = {};
    let tree = {};
    for(let i in listData){
      temp[listData[i].authorityId] = listData[i];
    }
    for(let i in temp){
      if(temp[i].parent && temp[temp[i].parent]) {
        if(!temp[temp[i].parent].children) {
          temp[temp[i].parent].children = new Object();
        }
        temp[temp[i].parent].children[temp[i].authorityId] = temp[i];
      } else {
        tree[temp[i].authorityId] =  temp[i];
      }
    }

    this.setState({ menuData: tree });
  }

  render() {
    const loopMenu = data => Object.keys(data).map(item => {
        if(data[item].children && data[item].children.length != 0){
          return (
            <SubMenu key={data[item].authorityId}
              title={<span><Icon type="appstore" className={data[item].parent == 0 ? "display-inline-block" : "display-none"}/><span className="nav-text">
                {/* <Link to={{ pathname: `/about${data[item].requestUrl}`, state: { systemId: data[item].systemId } }}>
                  {data[item].authorityName}
                </Link> */}
                {data[item].authorityName}
              </span></span>}
            >
              {loopMenu(data[item].children)}
            </SubMenu>)
        }else{
          return (
            <Menu.Item key={data[item].authorityId}>
              <span><Icon type="appstore" className={data[item].parent == 0 ? "display-inline-block" : "display-none"}/><span className="nav-text">
                <Link to={{ pathname: `/about${data[item].requestUrl}`, state: { systemId: data[item].systemId } }}>
                  {data[item].authorityName}
                </Link>
              </span></span>
            </Menu.Item>
          )
        }
    })

    const loopSubMenu = data => Object.keys(data).map(item => {
      return (
        <Menu.Item key={data[item].authorityId}>
          <span className="nav-text">
            <Link to={{ pathname: `/about${data[item].requestUrl}`, state: { systemId: data[item].systemId } }}>
              {data[item].authorityName}
            </Link>
          </span>
        </Menu.Item>
      )
    })

    return (
      this.state.menuData ? <div>
        {/* <Switch onChange={this.changeMode.bind(this)} /> */}
        {/* <br />
        <br /> */}
        <Menu
          style={{ width: `100%` }}
          mode={this.state.mode}
          theme={this.state.theme}
        >
          {loopMenu(this.state.menuData)}
        </Menu>
      </div> : <div></div>
    );
  }
}

export default Sider;