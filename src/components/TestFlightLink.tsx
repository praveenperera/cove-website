import Link from 'next/link'

type Args = {
  color?: 'black' | 'white' | 'blue'
  className?: string
}

function buttonColor(color: string): string {
  if (color == 'black') {
    return 'bg-gray-800 hover:bg-gray-700 text-white'
  }

  if (color == 'white') {
    return 'bg-white hover:bg-gray-100 text-gray-900'
  }

  if (color == 'blue') {
    return 'bg-blue-800 hover:bg-blue-700 text-white'
  }

  return 'bg-gray-900 hover:bg-gray-800 text-white'
}

export function TestFlightLink({ color = 'black', className = '' }: Args) {
  return (
    <Link
      href="https://TestFlight.apple.com/join/pDxFQsxF"
      aria-label="Join TestFlight Beta"
      className={`inline-flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-center font-semibold sm:w-auto ${buttonColor(color)} ${className}`}
    >
      <svg
        className="hidden h-5 w-5 pr-1 sm:flex sm:w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
      </svg>
      <span className="w-full sm:w-auto">Join TestFlight Beta</span>
    </Link>
  )
}
