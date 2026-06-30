import { Component, ReactNode, ErrorInfo } from 'react'
import { Result, Button } from 'antd'

interface Props {
  children: ReactNode
  module?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.module ? `:${this.props.module}` : ''}]`, error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title={`${this.props.module || '应用'} 发生错误`}
          subTitle={this.state.error?.message}
          extra={
            <Button
              type="primary"
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
            >
              重新加载
            </Button>
          }
        />
      )
    }
    return this.props.children
  }
}
