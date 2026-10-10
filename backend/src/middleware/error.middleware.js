/*
|--------------------------------------------------------------------------
| 404 - ROUTE NOT FOUND
|--------------------------------------------------------------------------
*/

export const notFound = (
  req,
  res
) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
};

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(
    "Unhandled server error:",
    error
  );

  if (res.headersSent) {
    return next(error);
  }

  const statusCode =
    error.statusCode ||
    error.status ||
    500;

  return res
    .status(statusCode)
    .json({
      success: false,

      message:
        statusCode < 500
          ? error.message
          : "Internal server error",
    });
};