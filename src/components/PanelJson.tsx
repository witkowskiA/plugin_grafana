
import React, { ChangeEvent, useEffect, useState, } from 'react';
import './PanelJson.css';
/***
 * core component
 * Alain Witkowski
 ***/
import { css, cx } from '@emotion/css';
import { PanelProps, SelectableValue } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Select, useStyles2 } from '@grafana/ui';
import { nanoid } from 'nanoid';
import Delete from '../img/delete.svg';
import AddIcon from '../img/plus.svg';
import { Row, RowComponent } from './form/RowComponent';
import { TextComponent } from './form/TextComponent';
//type DisplayText = Omit<Row, "id">;
export interface Test {
  text: string;
}


export const PanelJson: React.FC<PanelProps> = ({ data, width, height }) => {
  const [row, setRow] = useState<string>('');
  const [val, setValue] = useState<string>('0');
  const [rows, setRows] = useState<Row[]>([]);
  const [datasource, setDatasource] = useState<string[]>([]);
  const getStyles = () => {
    return {
      app: css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 1fr;
        gap: 0px 0px;
        grid-template-areas: 'left textContainer';
      `,
      left: css`
        grid-area: left;
      `,
      textContainer: css`
        grid-area: textContainer;
      `,
      addBtn: css`
        background-color: green;
        font-weight: bold;
      `,
    };
  };
  // const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const formatJson = (rowsItem: Row[]) => {
    const newItem = rowsItem.map((item) => {
      const arrayFromValue = [item.type, item.value];

      return arrayFromValue;
    });
    return JSON.stringify(Object.fromEntries(newItem), undefined, 2);
  };
  let jsonText = formatJson(rows);
  const setRowOrValue = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === 'row') {
      setRow(event.target.value);
    } else {
      setValue(String(event.target.value));
    }
  };

  const handleChangeRow = (rowToChange: Row) => {
    setRows(
      rows.map((rowItem) => {
        if (rowItem.id === rowToChange.id) {
          rowItem = rowToChange;
        }
        return rowItem;
      })
    );

    jsonText = formatJson(rows);
  };
  const addTask = (): void => {
    const newRow = {
      id: nanoid(),
      type: row,
      value: val,
    };

    setRows([...rows, newRow]);
    setRow('');
    setValue('');
    jsonText = formatJson(rows);
  };
  //get dataSource
  useEffect(() => {
    const dataSourceSrv: any = getDataSourceSrv();
    let datasource: any = [];
   
    Object.keys(dataSourceSrv.datasources).forEach((key: string) => {
   
      datasource.push(dataSourceSrv.datasources[key].meta.id);
  
    });

    if (datasource) {
      setDatasource(datasource);
    }
  }, []);

  console.log('data2', datasource);
  const deleteRow = (rowToDelete: string): void => {
    setRows(
      rows.filter((row) => {
        // eslint-disable-next-line eqeqeq
        return row.id != rowToDelete;
      })
    );
    jsonText = formatJson(rows);
  };
  const deleteRows = (): void => {
    setRows([]);
    jsonText = formatJson(rows);
  };
  const test = (value: SelectableValue<string>): void => {
    console.log(value);
  };
  return (

    <div
      className={cx(
        styles.app,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <div className="left">
        <div className="header">
          <Select value={datasource} onChange={test}>
            {datasource.map((source) => {
              return <option key={source}>{source}</option>;
            })}
          </Select>
          <div className="inputContainer">
            <input type="text" placeholder="add key" name="row" value={row} onChange={setRowOrValue} />

            <input type="text" placeholder="add value" name="val" value={val} onChange={setRowOrValue} />
          </div>
          <button onClick={addTask} className="btn addBtn" title="add item">
         
            <img className="icon" src={AddIcon} alt='add'/> 
       
            add
          </button>
        </div>

        <div className="rowList">
          {rows.map((row: Row) => {
            return <RowComponent key={row.id} row={row} deleteRow={deleteRow} handleChangeRow={handleChangeRow} />;
          })}
        </div>

        {rows.length > 1 ? (
          <button className="btn deleteBtn center" onClick={deleteRows} title=" delete all">
           <img className="icon" src={Delete} alt='delete'/> 
            delete all
          </button>
        ) : (
          ''
        )}
      </div>
      <div className="textContainer">
        <TextComponent rows={jsonText} data={data} />
      </div>
    </div>
  );
};
