-- Realtime notification triggers (SSE bridge via LISTEN/NOTIFY).

-- 1. Order status change → notify the order channel.
CREATE OR REPLACE FUNCTION notify_order_status() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('order:' || NEW.id, NEW.status);
  IF NEW.status = 'CONFIRMED' OR NEW.status = 'READY' OR NEW.status = 'COMPLETED' OR NEW.status = 'CANCELLED' THEN
    PERFORM pg_notify('admin:orders', NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_status ON "Order";
CREATE TRIGGER trg_order_status AFTER UPDATE OF status ON "Order"
  FOR EACH ROW EXECUTE FUNCTION notify_order_status();

-- 2. New order → notify the admin queue.
CREATE OR REPLACE FUNCTION notify_new_order() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('admin:orders', 'new');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_new_order ON "Order";
CREATE TRIGGER trg_new_order AFTER INSERT ON "Order"
  FOR EACH ROW EXECUTE FUNCTION notify_new_order();

-- 3. Payment confirmed (Transaction → SUCCESS) → notify the order channel as 'paid'.
CREATE OR REPLACE FUNCTION notify_payment_success() RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'SUCCESS' AND OLD.status IS DISTINCT FROM 'SUCCESS' THEN
    PERFORM pg_notify('order:' || NEW."orderId", 'paid');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_success ON "Transaction";
CREATE TRIGGER trg_payment_success AFTER UPDATE OF status ON "Transaction"
  FOR EACH ROW EXECUTE FUNCTION notify_payment_success();
