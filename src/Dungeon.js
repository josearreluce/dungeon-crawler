import React, { Component } from 'react';
import Menu from './Menu.js';
import Player from './Player.js';
import {Partition} from './Partition.js';
import {Room} from './Partition.js';
import {RoomBuilder} from './Partition.js';

class Cell extends Component {
    render () {
      var cellClass = "cell " + this.props.type;
      return (
        <td className={cellClass} id={[this.props.x,this.props.y]} style={this.props.styles}>
        </td>
      );
    }
}

class Dungeon extends Component {
  constructor () {
      super();

      this.generateGrid = this.generateGrid.bind(this);
      this.getHeight = this.getHeight.bind(this);
      this.getWidth = this.getWidth.bind(this);
      this.getRandomPoint = this.getRandomPoint.bind(this);
      this.partition = this.partition.bind(this);

      var cellTypes = [];
      for(var i = 0; i < 100; i++) {
        cellTypes.push(new Array(100).fill("wall"));
      }

      this.state = {
        cellTypes: cellTypes,
        cells: [],
        height: 100,
        width: 100
      };
  }

  componentDidMount() {
    var root = this.partition();
    var leafNodes = root.getLeafNodes(root);
    var roomConstructor = new RoomBuilder;
    roomConstructor.generateRooms(leafNodes);
    var cellTypes = roomConstructor.placeRooms(this.state.cellTypes, leafNodes);
    cellTypes = root.connectPartitions(cellTypes, root);
    var player = new Player;
    cellTypes = player.placePlayer(cellTypes, leafNodes);
    var cells = this.generateGrid(10000, cellTypes, player);
  }

  generateGrid(size, cellTypes, player) {
    var cells = [];
    for(var y = 0; y < this.state.height; y++) {
      var row = [];
      for(var x = 0; x < this.state.width; x++) {
        var cellOpacity = 0;
        if(player.withinView(x, y, cellTypes)) {
          cellOpacity = 1;
        }
        
        var styles = {opacity: cellOpacity};
        row.push(<Cell key={x} x={x} y={y} type={cellTypes[y][x]} styles={styles} />);
      }
      cells.push(<tr key={y}>{row}</tr>);
    }

    this.setState({
      cells: cells,
      cellTypes: cellTypes
    });
  }

  getWidth(maxSize) {
    return Math.floor(Math.random() * maxSize);
  }

  getHeight(maxSize) {
    return Math.floor(Math.random() * maxSize);
  }

  getRandomPoint(gridSize) {
    var x = Math.floor(Math.random() * (gridSize / 100));
    var y = Math.floor(Math.random() * (gridSize / 100));
    return [x,y];
  }

  partition() {
    var root = new Partition(100, 100, 0, 0);
    root.split(5, 0);
    return root;
  }

  render () {
    return (
      <div id="dungeon">
        <div id="notice">
          <h2> ReactJS Roguelike Dungeon Crawler </h2>
          <p> This is a work in progress. </p>
          <Menu />
        </div>
        <table>
          <tbody>
            { this.state.cells }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Dungeon;
