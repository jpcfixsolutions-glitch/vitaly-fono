export const Container = ({ className = "", children }) => {
  return (
    <>
      <div className="margin-top"></div>
      <div className={`funcionality-container ${className}`}>
        {children}
      </div>
      <div className="margin-bottom"></div>
    </>
  );
}