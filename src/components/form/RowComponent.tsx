

import React, { ChangeEvent } from 'react';
import Delete from '../../img/delete.svg';
/**
 * form row component
 * Alain Witkowski
 */
export type Row = {
  id: string;
  type: string;
  value: string;
};
export type Props = {
  row: Row;
  deleteRow(rowToDelete: string): void;
  handleChangeRow(row: Row): void;
};

export const RowComponent: React.FC<Props> = ({ row, deleteRow, handleChangeRow }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const currentRow = {
      id: row.id,
      type: event.target.name.includes('rowResult') ? event.target.value : row.type,
      value: !event.target.name.includes('rowResult') ? event.target.value : row.value,
    };

    handleChangeRow(currentRow);
  };
  return (
    <div className="row">
      <input type="text" name={row.id+'rowResult'} id={row.id+'type'} value={row.type} onChange={handleChange} />
      <input type="text" name={row.id + 'valresult'} id={row.id+'value'} value={row.value} onChange={handleChange} />
      <button
        className="btn deleteBtn"
        type="button"
        onClick={() => {
          deleteRow(row.id);
        }}
        title="delete"
      >
       
        <img className="icon" src={Delete} alt='delete'/> 
        delete
      </button>
    </div>
  );
};
