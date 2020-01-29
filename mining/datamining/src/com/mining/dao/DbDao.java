package com.mining.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class DbDao {

	@Autowired
	private SqlSessionTemplate sqlSession;

	@SuppressWarnings("unchecked")
	public Map<String, Object> getJudge(List<Map<String, Object>> transData) {
		Map<String, Object> resultJudge = new HashMap<String, Object>(); // 쿼리문에대한결과
		Map<String,Object> result = new HashMap<>();
		Map<String,Object> reportResult = new HashMap<>(); // 리포트용
		for(Map<String,Object> row : transData){
			Map<String,Object> report = new HashMap<>();
			String id = nullToBlank(row.get("id"));
			String star = nullToBlank(row.get("star"));
			double sum=0,avg=0,cnt=0,elSum=0,elAvg=0,elCnt=0;
			for(String str : row.keySet()){
				if(str.equals("id")){}
				else if(str.equals("star")){}
				else if(str.equals("comment")){ //객체 key가 comment일때 실행
					ArrayList<String> comment = (ArrayList<String>) row.get("comment");
					for(String cmt : comment){
						int sqlResult = sqlSession.selectOne("dbDao.getList", cmt);//cmt에 단어를 불러와 해당
																					//단어 하나하나 쿼리
						if(sqlResult == 0){//0일경우 기록만 put
							report.put(cmt, sqlResult);
							reportResult.put(cmt, sqlResult);
						}
						else if(sqlResult != 0){ // 0이 아닐경우 sum에 더해주고 카운트횟수추가 하여 나중에 총 결과 확인함.
							sum+=sqlResult;
							cnt++;
							report.put(cmt, sqlResult);
							reportResult.put(cmt, sqlResult);
						}
					}
					if(sum!=0){//검사 안해주면 NAN 떠서 확인용  
						avg = sum/cnt;
					}
				} 
				else{ // 태그에 부합한 문장들 쿼리 위와 방식 동일 하나 sum,avg,cnt 는 따로 해당 문장에 대한 값 확인 
					ArrayList<String> elComment = (ArrayList<String>) row.get(str);
					for(String cmt : elComment){
						int sqlResult = sqlSession.selectOne("dbDao.getList", cmt);
						if(sqlResult == 0 ){
							report.put(cmt, sqlResult);
							reportResult.put(cmt, sqlResult);
						}
						else if(sqlResult != 0){
							elSum += sqlResult;
							elCnt++;
							report.put(cmt, sqlResult);
							reportResult.put(cmt, sqlResult);
						}
					}
					if(elSum!=0){
						elAvg = elSum/elCnt;
					}
				}
				
			}
			//평균 avg 함수가 elAvg도 있어서 이 두개의 함수 전부 0이 아니라면 결과값 put  
			if(avg !=0 && elAvg !=0){
				avg = avg + elAvg;
				avg = avg/2;
				avg+=Integer.parseInt(star);
				result.put("id",id);
				result.put("avg",avg);
				resultJudge.put(id,avg);
			}
			else if (avg == 0 && elAvg != 0){
				avg = elAvg+Integer.parseInt(star);
				result.put("id",id);
				result.put("avg",avg);
				resultJudge.put(id,avg);
			}
			else if (avg !=0 && elAvg == 0 ){
				avg+=Integer.parseInt(star);
				result.put("id",id);
				result.put("avg",avg);
				resultJudge.put(id,avg);
			}
			else if (avg ==0 && elAvg == 0 ){
				avg+=Integer.parseInt(star);
				result.put("id",id);
				result.put("avg",avg);
				resultJudge.put(id,avg);
			}
			System.out.println("최종결과 = "+ avg + "별점은 = " + star + " "+ row +""+ reportResult);
			reportResult.clear();
			//System.out.println(avg + "  : " + elAvg);
		}
		result.put("resultJudge", resultJudge);
		System.out.println("해당문장 총 결과 = " + resultJudge);
		//System.out.println("reportResult = " + reportResult);
		result.put("reportResult", reportResult);
		System.out.println("쿼리끝");
		return result;
	}
	
	
	//공란 확인용
	public static String nullToBlank(Object comment) {
        if (comment == null) return "";
        return String.valueOf(comment).trim();
    }
}
