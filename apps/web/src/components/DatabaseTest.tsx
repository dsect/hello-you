import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface User {
  id: number
  name: string
  email: string
  created_at: string
}

interface Post {
  id: number
  title: string
  content: string | null
  user_id: number
  created_at: string
}

export function DatabaseTest() {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('test_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      // Fetch posts with user info
      const { data: postsData, error: postsError } = await supabase
        .from('test_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (postsError) throw postsError

      setUsers(usersData || [])
      setPosts(postsData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4">Loading database data...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error connecting to database: {error}</p>
        <button
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Database Connection Test</h2>
        <p className="text-green-600 mb-4">✅ Connected to Supabase successfully!</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Test Users ({users.length})</h3>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="p-3 border rounded">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Test Posts ({posts.length})</h3>
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="p-3 border rounded">
              <h4 className="font-medium">{post.title}</h4>
              {post.content && <p className="text-sm text-gray-700 mt-1">{post.content}</p>}
              <p className="text-xs text-gray-500 mt-1">User ID: {post.user_id}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={fetchData}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Refresh Data
      </button>
    </div>
  )
}