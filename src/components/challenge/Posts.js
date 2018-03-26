import React, { Component, Fragment } from 'react'
import axios from 'axios'
import Post from 'components/challenge/Post'
import storage from 'storage'
import { map, includes, isEmpty, filter } from 'lodash'

class Posts extends Component {
  constructor() {
    super()
    this.state = { posts: [], upvotes: [], userId: null, userEmail: null }
  }

  componentDidMount() {
    const userId = storage.get('userId')
    const userEmail = storage.get('userEmail')
    const authToken = storage.get('authToken')
    this.setState({ userId, userEmail })
    this.api = axios.create({
      baseURL: 'https://api.hackclub.com/',
      headers: { 'Authorization': `Bearer ${authToken}` }
    })

    this.refreshPosts()
  }

  refreshPosts() {
    const userId = storage.get('userId')

    this.api.get(`v1/challenges/${this.props.challengeId}/posts`).then(res => {
      let posts = res.data || []

      // array of post ids that user has upvoted
      let upvotes = []
      posts.forEach(post => {
        post.upvotes.forEach(upvote => {
          if (upvote.user.id == userId) {
            upvotes.push(post.id)
          }
        })
      })

      console.log(upvotes)
      posts.map(post => {
        post.upvotesCount = post.upvotes.length
        return post
      })

      // sort by upvote count
      posts = posts.sort((p1, p2) => {
        return p2.upvotesCount - p1.upvotesCount
      })

      // TODO (later): remove upvotes array for better performace
      this.setState({ upvotes, posts })
    })
  }

  onUpvote(e, postId) {
    const { userId: authUser } = this.state
    if (isEmpty(authUser)) return
    if (includes(this.state.upvotes, postId)) {
      // if this is nil, this means we've ran into a race where this.state.posts
      // hasn't finished updating (probably from a this.refreshPosts call) -
      // just ignore the user action for the time being and let them retry once
      // it actually updates
      const upvote = this.state.posts
        .find(post => post.id == postId).upvotes
        .find(upvote => upvote.user.id == authUser)

      if (!upvote) {
        return
      }

      // immediately increment values so it feels responsive, later refresh
      // posts completely so we have the correct values in state

      // remove post from upvotes array //
      let upvotes = this.state.upvotes
      // w/ removed postId
      let truncatedUpvotes = upvotes.splice(upvotes.indexOf(postId), 1)
      this.setState(upvotes: truncatedUpvotes)

      // increment upvotesCount //
      let posts = this.state.posts
      let post = posts.find(post => post.id == postId)
      let postIndex = posts.indexOf(post)
      post.upvotesCount--
      posts[postIndex] = post
      this.setState(posts: posts)

      // actually make requests & refresh
      this.api.delete(`v1/upvotes/${upvote.id}`).then(res => {
        this.refreshPosts()
      })
    } else {
      // same deal here, immediately update state so it displays correctly then
      // do a complete refresh to ensure we have good values
 
      // add post to upvotes array //
      let upvotes = this.state.upvotes
      upvotes.push(postId)
      this.setState(upvotes: upvotes)

      // increment upvotesCount //
      let posts = this.state.posts
      let post = posts.find(post => post.id == postId)
      let postIndex = posts.indexOf(post)
      post.upvotesCount++
      posts[postIndex] = post
      this.setState(posts: posts)

      // actually make requests & refresh
      this.api.post(`v1/posts/${postId}/upvotes`).then(res => {
        this.refreshPosts()
      })
    }
  }

  render() {
    const { posts, upvotes } = this.state
    return (
      <Fragment>
        {posts.map(post => (
          <Post
            name={post.name}
            url={post.url}
            description={post.description}
            upvotes={post.upvotesCount}
            upvoted={includes(upvotes, post.id)}
            onUpvote={e => this.onUpvote(e, post.id)}
          />
        ))}
      </Fragment>
    )
  }
}

export default Posts
