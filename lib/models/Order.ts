// lib/models/OrderReference.js
import mongoose from 'mongoose';

// This is just a reference schema - not creating a real collection
const orderReferenceSchema = new mongoose.Schema({
  orderId: String,
  // Add minimal fields you need for reference
});

// This just registers the schema for reference, not creating a collection
const OrderReference =
  mongoose.models.Order || mongoose.model('Order', orderReferenceSchema);
export default OrderReference;
