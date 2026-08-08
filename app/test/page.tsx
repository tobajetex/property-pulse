import { connectDB } from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";

async function getTestData() {
  await connectDB();

  const userCount = await User.countDocuments();
  let testUser = null;

  if (userCount === 0) {
    testUser = new User({
      email: "test@example.com",
      username: "testuser",
      image: "https://example.com/avatar.jpg",
    });
    await testUser.save();
  } else {
    const existingUser = await User.findOne({});
    testUser = existingUser;
  }

  const propertyCount = await Property.countDocuments();
  let testProperty = null;

  if (propertyCount === 0 && testUser) {
    testProperty = new Property({
      owner: testUser._id,
      name: "Test Property",
      type: "Apartment",
      description: "This is a test property",
      location: {
        city: "Test City",
        state: "TS",
      },
      beds: 2,
      baths: 1,
      square_feet: 1000,
    });
    await testProperty.save();
  }

  const users = await User.find({}).lean();
  const properties = await Property.find({}).lean();

  return {
    userCount,
    testUser,
    propertyCount,
    testProperty,
    users: convertToSerializeableObject(users),
    properties: convertToSerializeableObject(properties),
  };
}

export default async function TestPage() {
  const data = await getTestData();

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
          <strong>📊 Users:</strong> {data.userCount} users found
        </div>

        {data.testUser && data.userCount === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong>👤 Test User:</strong> Created successfully
          </div>
        )}

        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <strong>🏠 Properties:</strong> {data.propertyCount} properties found
        </div>

        {data.testProperty && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong>🏠 Test Property:</strong> Created successfully
          </div>
        )}

        {/* Users Section */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">👥 All Users</h2>
          {data.users.length === 0 ? (
            <p className="text-gray-500">No users found in database</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data.users.map((user: any) => (
                <li key={String(user._id)} className="py-3 flex items-center">
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
                    <p className="text-xs text-gray-400">
                      ID: {String(user._id)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Properties Section */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">🏠 All Properties</h2>
          {data.properties.length === 0 ? (
            <p className="text-gray-500">No properties found in database</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data.properties.map((property: any) => (
                <li key={String(property._id)} className="py-3">
                  <div>
                    <p className="font-medium">{property.name}</p>
                    <p className="text-sm text-gray-500">
                      {property.type} • {property.location?.city},{" "}
                      {property.location?.state}
                    </p>
                    <p className="text-xs text-gray-400">
                      Owner: {String(property.owner)}
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
}
