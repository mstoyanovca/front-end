import React, {Component} from 'react';

export class Board extends Component {
      render() {
          return (
              <div className="board"> {this.props.cells.map(row => 
                  <div key={row[0].id.toString()} className="my-row"> {row.map(cell => 
                      <div key={cell.id.toString()} className={cell.className}></div>)}
                  </div>)}
              </div>
          );
      }
}