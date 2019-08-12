import { fetch } from '@request'

const state = () => ({
  dynamicTopicIndex: [], // 首页侧栏导航话题
  dynamicTopicList: [], // 专题页所有话题列表
  dynamicList: {
    count: 0,
    list: [],
    page: 1,
    pageSize: 10
  }, // 动态列表
  dynamicView: {}
})

const mutations = {
  SET_DYNAMIC_TOPIC_INDEX (state, data) {
    // 设置首页侧栏导航话题
    state.dynamicTopicIndex = data
  },
  SET_DYNAMIC_TOPIC_LIST (state, data) {
    // 设置首页侧栏导航话题
    state.dynamicTopicIndex = data
  },
  SET_DYNAMIC_LIST (state, data) {
    // 设置动态列表
    state.dynamicList = data
  },
  SET_DYNAMIC_VIEW (state, data) {
    // 设置动态内容
    state.dynamicView = data
  }
}

const actions = {
  GET_DYNAMIC_LIST ({ commit, dispatch, state }, parameter) {
    // 获取动态列表
    return fetch({
      url: '/dynamic/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_LIST', result.data)
      return result
    })
  },
  CREATE_DYNAMIC ({ commit, dispatch, state }, parameter) {
    // 创建动态
    return fetch({
      url: '/dynamic/create',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      return result
    })
  },
  GET_DYNAMIC_VIEW ({ commit, dispatch, state }, parameter) {
    // 获取动态内容
    return fetch({
      url: '/dynamic/view',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_VIEW', result.data.dynamic)
      return result
    })
  },
  UPLOAD_DYNAMIC_PICTURE: ({ commit, dispatch, state }, parameter) => {
    // 上传动态图片
    return fetch({
      url: '/dynamic/upload-dynamic-picture',
      method: 'post',
      parameter
    })
  },
  GET_DYNAMIC_TOPIC_INDEX ({ commit, dispatch, state }, parameter) {
    // 获取首页侧栏导航话题
    return fetch({
      url: '/dynamic-topic/index',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_TOPIC_INDEX', result.data.all)
      return result
    })
  },
  GET_DYNAMIC_TOPIC_LIST ({ commit, dispatch, state }, parameter) {
    // 获取首页侧栏导航话题
    return fetch({
      url: '/dynamic-topic/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_TOPIC_LIST', result.data.all)
      return result
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}