// Centralized Async Handler to prevent repetition of try{}catch(err){} blocks for every controller.
function centralAsyncHandler(controllerFn) {
  return async (req, res, next) => {
    try {
      // Executes the controller function asynchronously in a central try{}catch(err){} block.
      await controllerFn(req, res, next);
    } catch (error) {
      // Error is caught and passed onto the Centralized Error Handler
      next(error);
    }
  };
}

module.exports = centralAsyncHandler;
