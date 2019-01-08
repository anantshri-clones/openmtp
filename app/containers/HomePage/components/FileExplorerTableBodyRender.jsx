'use strict';

import React, { PureComponent } from 'react';
import { styles } from '../styles/FileExplorerTableBodyRender';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import FileExplorerTableHeadRender from './FileExplorerTableHeadRender';
import FileExplorerTableEmptyRowRender from './FileExplorerTableBodyEmptyRender';
import { DEVICES_TYPE_CONST } from '../../../constants';
import FileExplorerTableBodyGridWrapperRender from './FileExplorerTableBodyGridWrapperRender';
import FileExplorerTableBodyListWrapperRender from './FileExplorerTableBodyListWrapperRender';

class FileExplorerTableBodyRender extends PureComponent {
  constructor(props) {
    super(props);
  }

  isSelected = path => {
    const { directoryLists, deviceType } = this.props;
    const _directoryLists = directoryLists[deviceType].queue.selected;

    return _directoryLists.indexOf(path) !== -1;
  };

  ListingSwitcher = (type = 'grid') => {
    const { deviceType, directoryLists, tableSort } = this.props;
    const { nodes, order, orderBy } = directoryLists[deviceType];
    const _eventTarget = 'tableCellTarget';
    const { classes, ...parentProps } = this.props;

    switch (type) {
      case 'grid':
      default:
        return (
          <FileExplorerTableBodyGridWrapperRender
            {...parentProps}
            tableSort={tableSort({
              nodes,
              order,
              orderBy
            })}
            _eventTarget={_eventTarget}
            isSelected={this.isSelected}
          />
        );
        break;

      case 'list':
        return (
          <FileExplorerTableBodyListWrapperRender
            {...parentProps}
            tableSort={tableSort({
              nodes,
              order,
              orderBy
            })}
            _eventTarget={_eventTarget}
            isSelected={this.isSelected}
          />
        );
        break;
    }
  };

  render() {
    const {
      classes: styles,
      deviceType,
      fileExplorerListingType,
      hideColList,
      currentBrowsePath,
      directoryLists,
      mtpDevice,
      onSelectAllClick,
      onRequestSort,
      onContextMenuClick,
      onIsDraggable,
      onDragStart
    } = this.props;
    const { nodes, order, orderBy, queue } = directoryLists[deviceType];
    const { selected } = queue;
    const emptyRows = nodes.length < 1;
    const isMtp = deviceType === DEVICES_TYPE_CONST.mtp;

    return (
      <React.Fragment>
        <Table className={styles.table}>
          <FileExplorerTableHeadRender
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={onSelectAllClick.bind(this, deviceType)}
            onRequestSort={onRequestSort.bind(this, deviceType)}
            rowCount={nodes ? nodes.length : 0}
            hideColList={hideColList}
          />
          <TableBody
            draggable={onIsDraggable(deviceType)}
            onDragStart={event => {
              onDragStart(event, {
                sourceDeviceType: deviceType
              });
            }}
          >
            {emptyRows ? (
              <FileExplorerTableEmptyRowRender
                mtpDevice={mtpDevice}
                isMtp={isMtp}
                currentBrowsePath={currentBrowsePath}
                deviceType={deviceType}
                directoryLists={directoryLists}
                onContextMenuClick={onContextMenuClick}
              />
            ) : (
              this.ListingSwitcher(fileExplorerListingType[deviceType])
            )}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(FileExplorerTableBodyRender);