class StockException(Exception):
    """Base class for all Stock exceptions"""


class StockNotFoundException(StockException):
    """Error raised when stock is not found."""
    pass
