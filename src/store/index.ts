import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';
import createId from '@/lib/createId';


Vue.use(Vuex);

type RootState={
    recordList:  RecordItem[],
    tagList: Tag[],
    currentTag?:Tag,
}
const store = new Vuex.Store({
    state: {
        recordList: [],
        tagList: [],
        currentTag:undefined,
    }as RootState,
    mutations: {
        setCurrentTag(state,id:string){
            state.currentTag=state.tagList.filter(t => t.id === id)[0];

        },
        fetchRecords(state) {
            state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
        },
        createRecord(state, record) {
            const record2: RecordItem = clone(record);
            record2.createdAt = new Date();
            state.recordList.push(record2);
            store.commit('saveRecords');
        },
        saveRecords(state) {
            window.localStorage.setItem('recordList',
                JSON.stringify(state.recordList));
        },
        fetchTags(state) {
            state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '[]') as [];
        },
        createTag(state, name: string) {
            const names = state.tagList.map(item => item.name);
            if (names.indexOf(name) >= 0) {
                window.alert('标签名重复');
                return 'duplicated';
            }
            const id = createId().toString();
            state.tagList.push({id: id, name: name});
            store.commit('saveTags');
            return 'success';

        },
        saveTags(state) {
            window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
        },
        findTag(state,id: string) {
            return state.tagList.filter(t => t.id === id)[0];
        },
    }

});
export default store;
