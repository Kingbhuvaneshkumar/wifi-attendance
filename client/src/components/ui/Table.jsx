const Table = ({ columns, data }) => (
  <table className="table">
    <thead>
      <tr>{columns.map((col) => <th key={col.accessor}>{col.header}</th>)}</tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          {columns.map((col) => <td key={col.accessor}>{row[col.accessor]}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
