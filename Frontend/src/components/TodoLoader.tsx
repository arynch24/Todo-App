

const TodoLoader = () => {
  return (
    <div className="todo-loader-container w-md mt-10">
      {[1, 2, 3, 4, 5].map((_, idx) => (
        <div key={idx} className="shimmer-item pb-1">
          <div className="shimmer-avatar" />
          <div className="shimmer-line " />
        </div>
      ))}
    </div>
  );
};

export default TodoLoader;
