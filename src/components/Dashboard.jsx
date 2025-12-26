import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { 
  Plus, 
  LogOut, 
  Plane, 
  Users, 
  DollarSign, 
  Ticket,
  ChevronRight,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import TripDetail from './TripDetail';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { trips, loading, createTrip, joinTrip } = useTrips();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [newTripName, setNewTripName] = useState('');
  const [newTripDescription, setNewTripDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [createdCode, setCreatedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  // Get the selected trip from the trips array (always fresh data)
  const selectedTrip = trips.find(t => t.id === selectedTripId);

  async function handleCreateTrip(e) {
    e.preventDefault();
    setError('');
    setCreating(true);

    const result = await createTrip({
      name: newTripName,
      description: newTripDescription
    });

    if (result.success) {
      setCreatedCode(result.inviteCode);
      setNewTripName('');
      setNewTripDescription('');
    } else {
      setError(result.error);
    }
    setCreating(false);
  }

  async function handleJoinTrip(e) {
    e.preventDefault();
    setError('');
    setJoining(true);

    const result = await joinTrip(inviteCode);
    
    if (result.success) {
      setShowJoinModal(false);
      setInviteCode('');
    } else {
      setError(result.error);
    }
    setJoining(false);
  }

  function copyInviteCode() {
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function closeCreateModal() {
    setShowCreateModal(false);
    setCreatedCode('');
    setNewTripName('');
    setNewTripDescription('');
    setError('');
  }

  if (selectedTripId && selectedTrip) {
    return <TripDetail trip={selectedTrip} onBack={() => setSelectedTripId(null)} />;
  }

  // If trip was deleted or user left, reset selection
  if (selectedTripId && !selectedTrip) {
    setSelectedTripId(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">$</span>
            </div>
            <h1 className="text-xl font-bold text-surface-800 font-display">OpenSplitMoney</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                  {user.displayName?.[0] || user.email?.[0] || '?'}
                </div>
              )}
              <span className="text-surface-700 font-medium hidden sm:block">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Action buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Create Trip
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-surface-50 border-2 border-surface-200 text-surface-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-lg hover:border-primary-300"
          >
            <Ticket className="w-5 h-5" />
            Join Trip
          </button>
        </div>

        {/* Trips list */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-surface-700 flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary-500" />
            Your Trips
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-surface-200">
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">No trips yet</h3>
              <p className="text-surface-500 mb-6">Create your first trip or join one with an invite code</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Trip
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {trips.map((trip, index) => (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`w-full bg-white hover:bg-surface-50 border border-surface-200 rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.01] animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-800 mb-1">{trip.name}</h3>
                      {trip.description && (
                        <p className="text-surface-500 text-sm mb-3">{trip.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-surface-600">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-primary-500" />
                          {trip.members?.length || 1} members
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-accent-500" />
                          {trip.expenses?.length || 0} expenses
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-surface-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Trip Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-slide-in">
            {createdCode ? (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-surface-800 mb-2">Trip Created!</h3>
                  <p className="text-surface-600 mb-6">Share this code with friends to invite them</p>
                  
                  <div className="bg-surface-100 rounded-xl p-4 mb-6">
                    <p className="text-sm text-surface-500 mb-2">Invite Code</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-bold tracking-widest text-primary-600">{createdCode}</span>
                      <button
                        onClick={copyInviteCode}
                        className="p-2 hover:bg-surface-200 rounded-lg transition-colors"
                        title="Copy code"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-primary-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-surface-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={closeCreateModal}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-surface-800 mb-6">Create New Trip</h3>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateTrip} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Trip Name
                    </label>
                    <input
                      type="text"
                      value={newTripName}
                      onChange={(e) => setNewTripName(e.target.value)}
                      placeholder="e.g., Goa Trip 2024"
                      required
                      className="w-full px-4 py-3 border-2 border-surface-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Description (optional)
                    </label>
                    <textarea
                      value={newTripDescription}
                      onChange={(e) => setNewTripDescription(e.target.value)}
                      placeholder="Add a short description..."
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-surface-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeCreateModal}
                      className="flex-1 py-3 border-2 border-surface-200 text-surface-700 font-semibold rounded-xl hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {creating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Create
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Join Trip Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-slide-in">
            <h3 className="text-xl font-bold text-surface-800 mb-6">Join a Trip</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleJoinTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-surface-200 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-center text-2xl tracking-widest uppercase"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowJoinModal(false); setInviteCode(''); setError(''); }}
                  className="flex-1 py-3 border-2 border-surface-200 text-surface-700 font-semibold rounded-xl hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joining || inviteCode.length !== 6}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {joining ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Join Trip'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
