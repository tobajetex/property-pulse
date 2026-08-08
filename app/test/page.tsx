import { connectDB } from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";

export default async function TestPage() {
  try {
    // Test 1: Connect to MongoDB
    await connectDB();
    console.log("✅ Database connected");

    // Test 2: Check if we can query the database
    const userCount = await User.countDocuments();
    console.log(`✅ Found ${userCount} users in database`);

    // Test 3: Get or create a test user
    let testUser = null;

    if (userCount === 0) {
      // No users exist - create one
      testUser = new User({
        email: "test@example.com",
        username: "testuser",
        image: "https://example.com/avatar.jpg",
      });
      await testUser.save();
      console.log("✅ Created test user");
    } else {
      // Use existing user
      const existingUser = await User.findOne({});
      testUser = existingUser;
      console.log(`✅ Using existing user: ${testUser?.username}`);
    }

    // Test 4: Check properties
    const propertyCount = await Property.countDocuments();
    console.log(`✅ Found ${propertyCount} properties`);

    // Test 5: Create a test property (only if we have a valid user)
    let testProperty = null;
    if (propertyCount === 0 && testUser) {
      testProperty = new Property({
        owner: testUser._id, // ✅ This is now a valid ObjectId
        name: "Test Property",
        type: "Apartment",
        description: "This is a test property created by the test page",
        location: {
          city: "Test City",
          state: "TS",
        },
        beds: 2,
        baths: 1,
        square_feet: 1000,
        amenities: ["Wifi", "Kitchen"],
        rates: {
          nightly: 100,
          weekly: 600,
          monthly: 2000,
        },
        seller_info: {
          name: "Test Seller",
          email: "seller@example.com",
          phone: "123-456-7890",
        },
        is_featured: false,
      });
      await testProperty.save();
      console.log("✅ Created test property");
    } else if (propertyCount === 0 && !testUser) {
      console.log("⚠️ No user available to associate property with");
    } else {
      console.log(`✅ Found ${propertyCount} properties, skipping creation`);
    }

    // Get all users and properties for display
    const users = await User.find({}).lean();
    const properties = await Property.find({}).lean();

    const serializedUsers = convertToSerializeableObject(users);
    const serializedProperties = convertToSerializeableObject(properties);

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">
            🧪 Backend Test Results
          </h1>

          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong>✅ Database:</strong> Connected successfully
          </div>

          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <strong>📊 Users:</strong> {userCount} users found
          </div>

          {testUser && userCount === 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong>👤 Test User:</strong> Created successfully
            </div>
          )}

          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <strong>🏠 Properties:</strong> {propertyCount} properties found
          </div>

          {testProperty && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong>🏠 Test Property:</strong> Created successfully
            </div>
          )}

          {/* Users Section */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">👥 All Users</h2>
            {serializedUsers.length === 0 ? (
              <p className="text-gray-500">No users found in database</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {serializedUsers.map((user) => (
                  <li key={user._id} className="py-3 flex items-center">
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.username}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">ID: {user._id}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Properties Section */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">🏠 All Properties</h2>
            {serializedProperties.length === 0 ? (
              <p className="text-gray-500">No properties found in database</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {serializedProperties.map((property) => (
                  <li key={property._id} className="py-3">
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-gray-500">
                        {property.type} • {property.location?.city},{" "}
                        {property.location?.state}
                      </p>
                      <p className="text-xs text-gray-400">
                        Owner: {property.owner}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>📝 Test completed at: {new Date().toLocaleString()}</p>
            <p>🔧 Environment: {process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Test failed:", error);

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-6">
            ❌ Backend Test Failed
          </h1>

          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong>{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>

          <div className="mt-4 bg-gray-100 p-4 rounded">
            <h2 className="font-semibold mb-2">Make sure you have:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Created a .env.local file with MONGODB_URI</li>
              <li>MongoDB running or MongoDB Atlas connection string</li>
              <li>All dependencies installed (npm install)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
